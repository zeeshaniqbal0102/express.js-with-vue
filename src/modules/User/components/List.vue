<template>
  <v-card class="elevation-0">
    <v-toolbar class="elevation-0" height="45" color="gray">
      <v-toolbar-title>
        <h1 class="subheading font-weight-regular">{{ $t('pageHeader.users') }}</h1>
        <v-btn v-if="!hideCreate" color="info" dark small absolute bottom right fab to="invite">
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-title>
      <v-layout>
        <v-flex xs12 sm6 md4>
          <v-text-field
            v-model="search"
            :append-icon="`${(search) ? 'close' : 'search'}`"
            @click:append="search = ''"
            label="Search"
            single-line
            hide-details
          />
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="users"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left small-td">{{ props.item.firstName }}</td>
          <td class="text-xs-left">{{ (props.item.lastName) ? props.item.lastName : 'N/A' }}</td>
          <td class="text-xs-left">{{ (props.item.phoneNumber) ? props.item.phoneNumber : 'N/A' }}</td>
          <td class="text-xs-left">{{ (props.item.email) ? props.item.email : 'N/A' }}</td>
          <td class="justify-center layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list class="menu-button">
                <v-list-tile @click="edituser(props.item)" v-if="currentUser.id === props.item.id">
                  <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="deleteuser(props.item)" disabled>
                  <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import userService from '../service';

export default {
  name: 'user-list',
  props: ['hideCreate'],
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.firstName'),
          value: 'firstName',
          sortable: true,
          width: '25%',
        },
        {
          text: this.$t('labels.lastName'),
          value: 'lastName',
          sortable: true,
          width: '25%',
        },
        {
          text: this.$t('labels.phoneNumber'),
          value: 'phoneNumber',
          sortable: false,
        },
        {
          text: this.$t('labels.emailAddress'),
          value: 'email',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      users: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'firstName',
      },
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters('global', ['currentUser']),
  },
  watch: {
    search() {
      if (this.search.length > 3 || this.search.length === 0) {
        this.getList();
      }
    },
    pagination: {
      handler() {
        this.pagination.totalItems = this.count;
        this.getList();
      },
      deep: true,
    },
  },
  methods: {
    getList() {
      this.loading = true;
      const { page, rowsPerPage } = this.pagination;
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage;
      }
      this.limit = rowsPerPage;
      return userService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then((response) => {
          this.users = response.data;
          this.count = response.count;
          this.loading = false;
          return response;
        });
    },
    edituser(user) {
      this.$router.push({ name: 'user-edit', params: user });
    },
    deleteuser(user) {
      this.$swal({
        title: this.$t('messages.title.areYouSure'),
        text: this.$t('messages.text.youWontBeAbleToRevert'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: this.$t('buttons.yesDeleteIt'),
      })
        .then((result) => {
          if (result.value) {
            userService.delete(user.id).then((response) => {
              if (response.data) {
                this.$swal(
                  this.$t('messages.title.deleted'),
                  this.$t('messages.text.userHasDelete'),
                  'success',
                );
                this.getList();
              }
            });
          }
        })
        .catch((error) => {
          // todo present this to the user
          console.log(error);
        });
    },
  },
};
</script>

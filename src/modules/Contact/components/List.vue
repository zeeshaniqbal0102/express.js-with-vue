<template>
  <v-container>
    <SearchBar v-model="search" />
    <v-card>
      <v-toolbar :color="$style.card.header" class="elevation-0">
        <v-toolbar-title>
          <v-layout column fill-height>
            <span class="title">{{ $t("pageHeader.contacts") }}</span>
          </v-layout>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="v-btn-with-radius white-btn" to="/contact/create">
          <v-icon left small>add</v-icon>
          {{ $t("buttons.new") }}
        </v-btn>
      </v-toolbar>


    
      <v-data-table
        :headers="headers"
        :items="contacts"
        class="table-header"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-left">
              <span>{{ props.item.fullName }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" class="ml-1" small color="#D0E9FF" v-if="props.item.keytag">
                    <v-icon small color="#3C4DA6">loyalty</v-icon>
                    <span>{{ props.item.keytag }}</span>
                  </v-chip>
                </template>
                <span>Keytag</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left">{{ props.item.phoneNumber }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="justify-end layout px-0">
              <v-menu bottom left offset-y>
                <v-btn slot="activator" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>

                <v-list class="menu-button">
                  <v-list-tile @click="openProfile(props.item)">
                    <v-list-tile-title>{{ $t("buttons.history") }}</v-list-tile-title>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile @click="editcontact(props.item)">
                    <v-list-tile-title>{{ $t("buttons.edit") }}</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="deletecontact(props.item)">
                    <v-list-tile-title>{{ $t("buttons.delete") }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import contactService from '../service';

const Create = () => import('./Create');

export default {
  name: 'contact-list',
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.name'),
          value: 'name',
          sortable: false,
        },
        {
          text: this.$t('labels.phoneNumber'),
          value: 'phoneNumber',
          sortable: false,
        },
        {
          text: this.$t('labels.email'),
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
      contacts: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'name',
      },
    };
  },
  components: {
    Create,
  },
  computed: {},
  watch: {
    search(val) {
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
      return contactService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          local: true,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then((response) => {
          this.contacts = response.data;
          this.count = response.count;
          this.loading = false;
          return response;
        });
    },
    openProfile(contact) {
      this.$router.push({ path: `/contact/${contact.id}/profile` });
    },
    editcontact(contact) {
      this.$router.push({ path: `/contact/${contact.id}/edit` });
    },
    deletecontact(contact) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          contactService.delete(contact.id).then((response) => {
            if (response.data) {
              this.$swal('Deleted!', 'contact has been deleted.', 'success');
              this.getList();
            }
          });
        }
      });
    },
  },
};
</script>

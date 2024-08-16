<template>
  <v-card class="elevation-0">
    <v-toolbar class="elevation-0" height="45" color="gray">
      <v-toolbar-title>
        <h1 class="subheading font-weight-regular">{{ $t('pageHeader.invites') }}</h1>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-card class="elevation-0" dark>
      <v-card-text>
        <v-layout row v-if="!hideCreate">
          <v-text-field
            v-model.trim="inviteEmail"
            :label="$t('labels.email')"
            :error-messages="inviteEmailErrors"
            single-line
          ></v-text-field>
          <v-btn color="info" @click="sendInvite">Invite</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
    </v-card-text>

    <v-card-text class="mt-0">
      <v-data-table
        :headers="headers"
        :items="invites"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left small-td">{{ $moment(props.item.createdAt).format('MM/DD/YY') }}</td>
          <td class="text-xs-left">{{ props.item.to }}</td>
          <td class="text-xs-left">{{ props.item.status.toLowerCase() }}</td>
          <td class="justify-center layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list class="menu-button">
                <v-list-tile @click="deleteInvite(props.item)">
                  <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <!-- <div>
    <v-card class="elevation-0">
      <v-card-title>
           <h2 class="h2-header">{{ $t('pageHeader.invites') }}</h2>
          <v-spacer></v-spacer>
          <v-layout row>

          <v-btn flat @click="sendInvite">Invite</v-btn>
        </v-layout>
        </v-card-title>

    </v-card>
  </div>-->
</template>
<script>
import userService from '../service';

const { validationMixin } = require('vuelidate');
const { required, email } = require('vuelidate/lib/validators');

export default {
  name: 'user-invite',
  props: ['hideCreate'],
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.date'),
          value: 'name',
          sortable: true,
          width: '25%',
        },
        {
          text: this.$t('labels.email'),
          value: 'phoneNumber',
          sortable: false,
        },
        {
          text: this.$t('labels.status'),
          value: 'status',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      inviteEmail: null,
      search: null,
      invites: [],
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
  created() {
    this.getList();
  },
  computed: {
    inviteEmailErrors() {
      const errors = [];
      if (!this.$v.inviteEmail.$dirty) return errors;
      if (!this.$v.inviteEmail.email) errors.push(this.$t('validations.emailIsNotValid'));
      return errors;
    },
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
    sendInvite() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        });
      } else {
        userService
          .sendInvite({ email: this.inviteEmail })
          .then((response) => {
            this.getList();
            this.inviteEmail = null;
          })
          .catch((error) => {
            this.$toasted.error(error.data, {
              position: 'top-right',
              showHideTransition: 'slide',
              duration: 3500,
            });
          });
      }
    },
    getList() {
      this.loading = true;
      const { page, rowsPerPage } = this.pagination;
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage;
      }
      this.limit = rowsPerPage;
      return userService
        .getInvites({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
          status: 'pending',
        })
        .then((response) => {
          this.invites = response.data;
          this.count = response.count;
          this.loading = false;
          return response;
        });
    },
    deleteInvite(invite) {
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
            userService.revokeInvite(invite.id).then((response) => {
              if (response.data) {
                this.$swal(
                  this.$t('messages.title.deleted'),
                  this.$t('messages.text.inviteWasRevoked'),
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
  mixins: [validationMixin],
  validations: {
    inviteEmail: {
      required,
      email,
    },
  },
};
</script>

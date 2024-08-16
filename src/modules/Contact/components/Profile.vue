<template>
  <v-card class="border-r-0">
    <v-toolbar class="elevation-0" color="gray">
      <v-toolbar-title>
        <h1 class="title font-weight-regular">{{ contact.fullName }}</h1>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list class="menu-button">
          <v-list-tile :to="`/contact/${ContactId}/edit`">
            <v-list-tile-avatar>
              <v-icon>edit</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="deleteContact()">
            <v-list-tile-avatar>
              <v-icon>delete</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-card-title>
      <v-layout column>
        <div>
          <span>{{$t('labels.phoneNumber')}}:</span>
          <span class="body-1 ml-1">{{ contact.phoneNumber }}</span>
        </div>
        <div>
          <span>{{$t('labels.email')}}:</span>
          <span class="body-1 ml-1" v-if="contact.email">{{ contact.email }}</span>
          <span class="body-1 ml-2" v-else>N/A</span>
        </div>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout align-end column>
        <v-flex class="mt-2">
          <div class="mt-2">
            <span>{{$t('labels.createdAt')}}:</span>
            <span class="body-1 ml-1">{{ contact.createdAt | moment("from", "now") }}</span>
          </div>
        </v-flex>
        <v-tooltip bottom v-if="contact.keytag">
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" class="ml-1" small color="#D0E9FF">
              <v-icon small color="#3C4DA6">loyalty</v-icon>
              <span>{{ contact.keytag }}</span>
            </v-chip>
          </template>
          <span>Keytag</span>
        </v-tooltip>
      </v-layout>
    </v-card-title>
  </v-card>
</template>
<script>
import contactService from '../service';

export default {
  name: 'contact-profile',
  props: ['ContactId'],
  data() {
    return {
      contact: {},
    };
  },
  created() {
    if (!this.ContactId) this.$router.push({ path: '/contact/list' });
    contactService
      .getById(this.ContactId)
      .then((response) => {
        this.contact = response.data;
      })
      .catch((error) => {
        switch (error.status) {
          case 404:
            this.$router.push({ path: '/contact/list' });
            break;
        }
      });
  },
  methods: {
    deleteContact() {
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
          contactService.delete(this.ContactId).then((response) => {
            if (response.data) {
              this.$swal('Deleted!', 'Contact has been deleted.', 'success');
              this.$router.push('/contact');
            }
          });
        }
      });
    },
  },
};
</script>

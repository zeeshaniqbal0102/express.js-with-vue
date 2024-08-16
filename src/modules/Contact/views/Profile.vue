<template>
  <v-layout column>
    <Profile :ContactId="id"/>
    <v-container fluid>
      <Invoices :ContactId="id" hideCreate="true"/>
    </v-container>

  </v-layout>
</template>
<script>
import Profile from '@/modules/Contact/components/Profile';
import Invoices from '@/modules/Invoice/components/List';
import contactService from '../service';

export default {
  name: 'contact-profile-view',
  components: {
    Profile,
    Invoices,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
};
</script>

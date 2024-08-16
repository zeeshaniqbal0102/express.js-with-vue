<template>
  <div>
    <v-layout column v-if="app">
      <v-card class="border-r-0">
        <!-- <v-btn icon class="ma-2" to="/marketplace">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>-->
        <v-card-text>
          <v-layout justify-space-between row fill-height>
            <v-btn icon class="ma-2" to="/marketplace">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <div class="text-xs-center">
              <h1 class="headline font-weight-regular">{{ app.name }}</h1>
              <h4 class="subheading">{{ app.description }}</h4>
              <h4 class="title font-weight-medium">{{ app.price | currency }}</h4>
            </div>
            <div></div>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-container>
        <div v-html="app.html"></div>
        <v-layout column class="my-2">
          <AppLocations class="mt-2" :app="app" :id="this.app.id"></AppLocations>
        </v-layout>
      </v-container>
    </v-layout>
    <v-dialog v-model="isLoading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{$t('labels.pleaseStandBy')}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import marketplaceService from '../service.js';
import AppLocations from '../components/AppLocations';

export default {
  name: 'marketplace-view-app',
  created() {
    this.loadApp();
  },
  components: {
    AppLocations,
  },
  data() {
    return {
      app: null,
      isLoading: true,
    };
  },
  methods: {
    loadApp() {
      if (!this.$route.params || !this.$route.params.id) return this.$router.push('/payee');
      const { id } = this.$route.params;
      this.$Progress.start();
      marketplaceService
        .getById(id)
        .then((response) => {
          this.$Progress.finish();
          this.app = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading;
          this.$router.go(-1);
        });
    },
  },
};
</script>

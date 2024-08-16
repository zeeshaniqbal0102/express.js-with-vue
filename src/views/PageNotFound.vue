<template>
  <v-container fluid class="pa-0 ma-0" id="login" style="overflow=hidden">
    <v-container fill-height="">
      <v-layout class="text-xs-center"  justify-center row fill-height>
        <v-flex xs10 md6 lg4>
          <v-card>
            <v-container>
              <h1>404</h1>
              <h2>Hey there! How did you get here?</h2>
              <p>The page you requested "{{ $route.path }}"" was not found.</p>
              <v-btn to="/">Home</v-btn>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

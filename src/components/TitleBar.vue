<template>
  <v-layout row class="mb-3">
    <v-flex shrink>
      <BackBtn />
    </v-flex>

    <v-flex grow class="text-xs-right" align-self-center>
      <h1 class="display-1 font-weight-light">{{ title }}</h1>
    </v-flex>

    
  </v-layout>
</template>

<script>
export default {
  props: ["title"]
};
</script>

<style scoped>
</style>
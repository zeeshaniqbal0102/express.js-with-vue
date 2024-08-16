<template>
  <v-layout row class="mb-3">
    <v-flex v-if="!hideBackBtn">
      <BackBtn />
    </v-flex>

    <v-flex align-self-center xs12 sm4 :class="{ 'offset-sm8': hideBackBtn }">
      <v-text-field
        v-model="search" class="rounded"
        prepend-inner-icon="search"
        @input="setValue()"
        data-cy="searchBar"
        label="Search"
        :append-icon="`${(search) ? 'close' : ''}`"
        @click:append="setNull()"
        single-line
        solo
        hide-details
      />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['hideBackBtn'],
  data() {
    return {
      search: null,
    }
  },
  methods: {
    setValue() {
      this.$emit('input', this.search)
    },
    setNull() {
      this.$emit('input', '')
      this.search = ''
    },
  },
};
</script>

<style scoped>
</style>

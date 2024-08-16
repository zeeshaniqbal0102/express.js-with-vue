<template>
  <v-toolbar :color="$style.card.header" class="elevation-0">
    <v-toolbar-title>
      <h1 class="subheading font-weight-regular">{{ title }}</h1>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-layout row align-center class="mt-0" justify-end>
      <v-flex shrink>
        <slot></slot>
      </v-flex>
      <v-flex shrink>
        <v-btn v-if="isModal" icon flat @click.stop.prevent="cancel">
          <v-icon small>close</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-toolbar>
</template>

<script>
export default {
  props: ['title', 'isModal'],
  methods: {
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped></style>

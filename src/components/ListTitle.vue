<template>
  <v-toolbar color="white" dense class="cardTitle" flat v-if="!hideHeader">
    <v-toolbar-title>
      <div class="title font-weight-regular">{{ title }}</div>
      <div v-if="subtitle" class="caption pt-1 text-truncate">{{ subtitle }}</div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot></slot>
    <v-btn v-if="!hideCreate" :data-cy="dataCy" outline round small @click="$emit('new')">
      {{ $t('buttons.new') }}
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  props: ['hideHeader', 'dataCy', 'title', 'hideCreate', 'subtitle'],
};
</script>

<style scoped></style>

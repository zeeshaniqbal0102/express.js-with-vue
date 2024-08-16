<template>
  <div>
    <v-btn class="white-btn-round" small fab icon @click.stop.prevent="$router.go(-1)">
      <v-layout column align-center>
        <v-icon>fas fa-angle-left</v-icon>
      </v-layout>
    </v-btn>
    <span v-if="!hideLabel" class="hidden-xs-only body-2 font-weight-medium">{{ $t('buttons.back') }}</span>
  </div>
</template>
<script>
export default {
  props: ['hideLabel'],
  name: 'back-button',
};
</script>

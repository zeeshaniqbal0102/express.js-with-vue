<template>
  <v-card-actions :style="{ 'background-color': $style.card.action }">
    <v-spacer></v-spacer>
    <v-btn class="white-btn v-btn-with-radius" :data-cy="`${this.name}CancelBtn`" @click.stop.prevent="cancel">{{ $t('buttons.cancel') }}</v-btn>
    <v-btn :loading="this.loading" :disabled="this.disabled" v-if="update" :data-cy="`${this.name}UpdateBtn`" color="purple" dark class="v-btn-with-radius" @click.stop.prevent="submit">{{ $t('buttons.update') }}</v-btn>
    <v-btn :loading="this.loading" :disabled="this.disabled" v-else color="info" :data-cy="`${this.name}SaveBtn`" class="v-btn-with-radius" @click.stop.prevent="submit">{{ $t('buttons.save') }}</v-btn>
  </v-card-actions>
</template>

<script>
export default {
  props: {
    update: {
      default: false,
    },
    name: {
      default: 'data-cy',
    },
    loading: {
      default: false,
    },
    disabled: {
      default: false,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.$emit('submit')
    },
  },
}
</script>

<style scoped></style>

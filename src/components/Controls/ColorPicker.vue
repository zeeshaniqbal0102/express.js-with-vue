<template>
  <div>
    <v-text-field 
      v-model="color.hex"
      solo readonly
      :append-icon="'color_lens'"
      @click:append="openColorDialog"
    ></v-text-field>    
    <v-dialog v-model="dialog" max-width="355">
      <v-card color="#F5F8FC">
        <v-toolbar :color="$style.card.header" class="elevation-0">
          <v-toolbar-title>
            <h1 class="subheading font-weight-regular">{{ $t('labels.pickColor') }}</h1>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon flat @click.stop.prevent="dialog = false">
            <v-icon small>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <swatches-picker v-model="color" :value="value" @input="setColor()"/>
        </v-card-text>

        <v-card-actions style="background-color: white">
          <v-spacer></v-spacer>
          <v-btn
            class="white-btn v-btn-with-radius"
            @click.stop.prevent="dialog = false"
          >{{ $t('buttons.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Swatches } from "vue-color";
export default {
  name: 'color-picker',
  props: ['value'],
  data() {
    return {
      dialog: false,
      color: { hex: this.value }
    };
  },
  components: {
    "swatches-picker": Swatches
  },
  methods: {
    openColorDialog() {
      this.dialog = !this.dialog;
    },
    setColor() {
      this.$emit('input', this.color.hex)
    }
  }
};
</script>

<style scoped>
</style>
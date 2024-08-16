<template>
  <v-card class="elevation-0 card-border-color pa-3">
    <v-btn class="deleteBtn" small absolute left fab color="red" dark v-if="imageURL" @click="image = null">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-layout column>
      <image-uploader
      hidden
      id="imageUploader"
      :debug="1"
      :maxWidth="250"
      :quality="0.7"
      :autoRotate="false"
      outputFormat="verbose"
      :preview="false"
      :className="['fileinput', { 'fileinput--loaded' : hasImage }]"
      accept="image/*"
      doNotResize="['gif', 'svg']"
      @input="setImage"
    ></image-uploader>
    <v-img :src="image" contain aspect-ratio="1.3333"></v-img>
    <v-layout row>
      <v-dialog max-width="500px" v-model="dialog">
        <v-card>
          <v-toolbar class="elevation-0" height="45" color="gray">
        <v-toolbar-title>
          <h1 class="subheading font-weight-regular">{{ $t('pageHeader.addURL') }}</h1>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
          <v-card-text>
            <v-text-field label="Image URL" v-model="url"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-layout align-center justify-space-between row>
            <v-btn color="pink" flat @click="dialog = false">{{ $t('buttons.cancel') }}</v-btn>
            <v-btn color="info" @click="submitURL">{{ $t('buttons.save') }}</v-btn>
          </v-layout>
          </v-card-actions>

        </v-card>
      </v-dialog>
      <v-btn fab @click="dialog = true" flat>
        <v-icon>mdi-earth</v-icon>
      </v-btn>
      <v-btn fab @click="uploadImage" flat>
        <v-icon>mdi-file-upload</v-icon>
      </v-btn>
    </v-layout>
    </v-layout>

  </v-card>
</template>
<script>
import settingService from '../modules/Settings/service.js';

const imagePlaceholder = require('../assets/images/no-image.png');

export default {
  name: 'image-box',
  props: ['imageURL'],
  data() {
    return {
      dialog: false,
      hasImage: false,
      url: null,
    };
  },
  computed: {
    image: {
      get() {
        if (this.imageURL) return this.imageURL;
        return imagePlaceholder;
      },
      set(val) {
        if (val) {
          return settingService
            .uploadMedia(val)
            .then((response) => {
              this.$emit('setImage', response.data.url);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.$emit('setImage', null);
      },
    },
  },
  methods: {
    setImage(file) {
      this.hasImage = true;
      this.image = file;
    },
    uploadImage() {
      document.getElementById('imageUploader').click();
    },
    submitURL() {
      this.dialog = false;
      this.$emit('setImage', this.url);
    },
  },
};
</script>
<style scoped>
  .deleteBtn {
    margin-top: -30px !important;
    margin-left: -35px !important;
  }
</style>

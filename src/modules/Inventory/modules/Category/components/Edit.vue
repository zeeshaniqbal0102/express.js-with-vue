<template>
  <div>
    <!-- Main Section -->
    <v-card>
      <v-toolbar class="elevation-0" height="45" color="gray">
        <v-toolbar-title>
          <h1 class="subheading font-weight-regular">{{ $t('pageHeader.editCategory') }}</h1>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="cancel">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-lg>
          <v-layout row>
            <ImageBox v-on:setImage="setImage" class="mr-3" :imageURL="category.imageURL"></ImageBox>
            <v-layout column>
              <v-flex xs12>
                <v-text-field
                  v-model.trim="category.name"
                  :error-messages="nameErrors"
                  :label="$t('labels.name')"
                  required
                  @input="$v.category.name.$touch()"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-select
                  :items="masterCategories"
                  :label="$t('labels.masterCategory')"
                  required
                  :error-messages="masterCategoryErrors"
                  item-value="id"
                  v-model="category.MasterCategoryId"
                  @input="$v.category.MasterCategoryId.$touch()"
                >
                  <template slot="selection" slot-scope="{ item }">{{ item.name }}</template>
                  <template slot="item" slot-scope="{ item }">
                    <v-layout column class="ma-2">
                      <v-flex>
                        <h4 class="h4-header">{{item.name}}</h4>
                      </v-flex>
                      <v-flex>
                        <v-subheader class="grey--text">{{item.description}}</v-subheader>
                      </v-flex>
                    </v-layout>
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-layout justify-end row>
          <v-btn color="pink" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
          <v-btn color="info" @click="submit">{{ $t('buttons.save') }}</v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
    <v-footer color="white" height="60" clipped-right fixed bottom v-if="!isModal">
      <v-layout justify-end row>
        <v-btn color="primary" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="primary" @click="submit">{{ $t('buttons.update') }}</v-btn>
      </v-layout>
    </v-footer>
  </div>
</template>


<script>
import categoryService from '../service';
import publicService from '@/api/public.js';
import ImageBox from '@/components/ImageBox';

const { validationMixin } = require('vuelidate');
const {
  required,
  minLength,
  decimal,
  minValue,
} = require('vuelidate/lib/validators');

export default {
  name: 'category-edit',
  props: {
    isModal: Boolean,
    id: Number,
  },
  components: {
    ImageBox,
  },
  data() {
    return {
      dialog: false,
      masterCategories: [],
      category: {
        name: null,
        imageURL: null,
        MasterCategoryId: null,
      },
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.category.name.$dirty) return errors;
      if (!this.$v.category.name.minLength) errors.push('Name must be at least 4 characters long');
      if (!this.$v.category.name.required) errors.push('Name is required.');
      return errors;
    },
    masterCategoryErrors() {
      const errors = [];
      if (!this.$v.category.MasterCategoryId.$dirty) return errors;
      if (!this.$v.category.MasterCategoryId.minValue) errors.push('Master Category is mandatory');
      return errors;
    },
  },
  async created() {
    await publicService
      .MasterCategories()
      .then((response) => {
        this.masterCategories = response.data;
      })
      .catch((error) => {
        throw error;
      });
    await this.loadCategory();
  },
  methods: {
    setImage(val) {
      this.category.imageURL = val;
    },
    loadCategory() {
      let id = null;
      if (this.isModal) {
        id = this.id;
      } else {
        id = this.$route.params.id;
      }
      if (!id) this.close();

      this.$Progress.start();
      categoryService
        .getById(id, { local: true })
        .then((response) => {
          this.$Progress.finish();
          this.category.id = response.data.id;
          this.category.name = response.data.name;
          this.category.imageURL = response.data.imageURL;
          this.category.MasterCategoryId = response.data.MasterCategoryId;
        })
        .catch(() => false);
      return true;
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal
          .mixin({
            toast: true,
            position: 'top-end',
            timer: 3000,
          })
          .fire({
            type: 'error',
            title: 'Missing fields',
          });
      } else {
        this.$Progress.start();
        categoryService
          .update(this.category.id, this.category)
          .then(() => {
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'success',
                title: 'Category was updated',
              });
            this.$Progress.finish();
            this.close();
          })
          .catch(() => {
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'error',
                title: this.$t('toastMessage.text.invalidFields'),
              });
            this.$Progress.fail();
          });
      }
    },
    cancel() {
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
  mixins: [validationMixin],
  validations: {
    category: {
      name: {
        required,
        minLength: minLength(4),
      },
      MasterCategoryId: {
        minValue: minValue(1),
      },
    },
  },
};
</script>

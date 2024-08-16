<template>
  <div>
    <!-- Main Section -->
    <v-card>
      <v-toolbar class="elevation-0" height="45" color="gray">
        <v-toolbar-title>
          <h1 class="subheading font-weight-regular">{{ $t('pageHeader.newCategory') }}</h1>
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
        <v-btn color="primary" @click="submit">{{ $t('buttons.save') }}</v-btn>
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
  props: ['isModal', 'searchText'],
  components: {
    ImageBox,
  },
  data() {
    return {
      masterCategories: [],
      category: {
        name: '',
        imageURL: null,
        MasterCategoryId: null,
      },
      savedCategory: null,
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.category.name.$dirty) return errors;
      if (!this.$v.category.name.minLength) errors.push(this.$t('validations.nameMushBeAtLeast4CharactersLong'));
      if (!this.$v.category.name.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    masterCategoryErrors() {
      const errors = [];
      if (!this.$v.category.MasterCategoryId.$dirty) return errors;
      if (!this.$v.category.MasterCategoryId.minValue) errors.push(this.$t('validations.masterCategoryIsMandatory'));
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
  },
  watch: {
    searchText(val) {
      if (val) this.category.name = val;
    },
  },
  methods: {
    setImage(val) {
      this.category.imageURL = val;
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
            title: this.$t('toastMessage.text.invalidFields'),
          });
      } else {
        this.$Progress.start();
        categoryService
          .create(this.category)
          .then((response) => {
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'success',
                title: 'Category was created',
              });
            this.$Progress.finish();
            this.savedCategory = response.data;
            this.close();
          })
          .catch((error) => {
            console.log(error);
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'error',
                title: 'Category was not created',
              });
            this.$Progress.fail();
          });
      }
    },
    cancel() {
      this.close();
    },
    close() {
      if (!this.isModal) {
        this.$router.go(-1);
      } else {
        this.$emit('close', this.savedCategory);
      }
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

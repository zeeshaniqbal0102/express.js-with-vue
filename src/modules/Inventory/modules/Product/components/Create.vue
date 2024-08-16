<template>
  <div>
    <v-container class="mw-1000 mb-5">
      <!-- Main Section -->
      <v-card class="pb-2 mb-3">
        <v-card-title>
          <span class="headline">{{ $t('pageHeader.product') }}</span>
        </v-card-title>
        <v-container grid-list-lg>

           <v-layout row wrap>

                <v-flex xs12 sm3>
                  <ImageBox v-on:setImage="setImage" :imageURL="product.imageURL"></ImageBox>
                </v-flex>

                <v-flex xs12 sm9>
                  <v-layout row wrap>
                    <v-flex xs12 sm6 md6>
                    <v-text-field
                      type="number"
                      v-model="product.upc"
                      :error-messages="upcErrors"
                      :label="$t('labels.upc')"
                      @input="$v.product.upc.$touch()"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      v-model="product.sku"
                      :label="$t('labels.skuCode')">
                      <template slot="append-outer"><v-btn color="blue-grey" outline dark small @click="generateSKU()">{{ $t('buttons.generate') }}</v-btn></template>
                    </v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model.trim="product.name"
                      :error-messages="nameErrors"
                      :label="$t('labels.name')"
                      required
                      @input="$v.product.name.$touch()"
                    ></v-text-field>
                  </v-flex>

                </v-layout>
                </v-flex>

              </v-layout>
            <v-layout row wrap>

              <v-flex xs12 md6>
                <v-autocomplete
                  :items="categories"
                  :label="$t('labels.category')"
                  required
                  :error-messages="categoryErrors"
                  item-text="name"
                  item-value="id"
                  v-model="product.CategoryId"
                  @input="$v.product.CategoryId.$touch()">
                  <template
                  slot="item"
                  slot-scope="{ item }">
                   <span>{{ item.name }}</span>
                    <v-spacer/>
                    <span class="caption">{{ item.MasterCategory.name }}</span>
                  </template>
                </v-autocomplete>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  type='number'
                  v-model.trim="product.sellingPrice"
                  :error-messages="priceErrors"
                  :label="$t('labels.price')"
                  prefix="$"
                  @input="$v.product.sellingPrice.$touch()"
                ></v-text-field>
              </v-flex>

            </v-layout>

        </v-container>

         <v-container>
          <v-tabs>

            <v-tab href="#tab-1"> {{ $t('tab.general') }} </v-tab>

            <v-tab href="#tab-2"> {{ $t('tab.additional') }} </v-tab>

            <v-tab-item value="tab-1">
              <v-card class="elevation-0">
                <v-container grid-list-lg>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-text-field
                        type='tel'
                        v-model="product.purchaseCost"
                        :error-messages="purchaseCostErrors"
                        :label="$t('labels.purchaseCost')"
                        @input="$v.product.purchaseCost.$touch()"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="product.brand"
                        :label="$t('labels.brandName')"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                      <v-textarea
                      v-model="product.description"
                      :label="$t('labels.description')">
                      </v-textarea>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-card>
            </v-tab-item>

            <v-tab-item value="tab-2">
              <v-card class="elevation-0">

                <v-container grid-list-lg>
                  <v-layout row wrap>

                    <v-flex xs12 md4>
                      <v-text-field
                        type='tel'
                        v-model="product.initialBalance"
                        :label="$t('labels.initialBalance')"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md4>
                        <v-text-field
                          type='tel'
                          v-model="product.minBalance"
                          :label="$t('labels.reOrderPoint')"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs12 md4>
                        <v-text-field
                          type='tel'
                          v-model="product.maxBalance"
                          :label="$t('labels.reOrderAmount')"
                        ></v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>

              </v-card>
            </v-tab-item>

          </v-tabs>
        </v-container>

      </v-card>

    </v-container>
    <v-footer color="white" height="60" clipped-right
    fixed bottom
    >
      <v-layout justify-end row v-if="!isModal">
        <v-btn color="primary" flat @click="cancel" >{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="primary"  @click="submit">{{ $t('buttons.save') }}</v-btn>
      </v-layout>
    </v-footer>
  </div>

</template>

<script>
import productService from '../service'
import ImageBox from '@/components/ImageBox'

const { validationMixin } = require('vuelidate')
const {
  required,
  minLength,
  decimal,
  minValue,
} = require('vuelidate/lib/validators')

export default {
  name: 'product-create',
  props: {
    isModal: Boolean,
  },
  components: {
    ImageBox,
    // CategoryAutocomplete,
  },
  data() {
    return {
      tab: null,
      categories: [],
      product: {
        upc: null,
        sku: null,
        name: null,
        active: true,
        CategoryId: 0,
        sellingPrice: null,
        purchaseCost: null,
        brand: null,
        imageURL: null,
        description: null,
        initialBalance: null,
        reOrderAmount: null,
        minBalance: null,
        maxBalance: null,
        CSPCatalogId: null,
      },
    }
  },
  computed: {
    upcErrors() {
      const errors = []
      if (!this.$v.product.upc.minLength) errors.push(this.$t('validations.upcLimit', [this.$v.product.upc.$params.minLength.min]))
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.product.name.$dirty) return errors
      if (!this.$v.product.name.minLength) errors.push(this.$t('validations.nameMushBeAtLeast4CharactersLong'))
      if (!this.$v.product.name.required) errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    categoryErrors() {
      const errors = []
      if (!this.$v.product.CategoryId.$dirty) return errors
      if (!this.$v.product.CategoryId.minValue) errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    priceErrors() {
      const errors = []
      if (!this.$v.product.sellingPrice.$dirty) return errors
      if (!this.$v.product.sellingPrice.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.product.sellingPrice.decimal) errors.push(this.$t('validations.priceMustBeAValidNumber'))
      return errors
    },
    purchaseCostErrors() {
      const errors = []
      if (!this.$v.product.purchaseCost.$dirty) return errors
      if (!this.$v.product.purchaseCost.decimal) errors.push('Purchase cost must be a valid number.')
      return errors
    },
  },
  created() {
    productService.getCategories()
      .then((response) => {
        this.categories = response.data
      })
      .catch((error) => { throw error })
  },
  methods: {
    setImage(val) {
      this.product.imageURL = val
    },
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
      } else {
        this.$Progress.start()
        productService.create(this.product)
          .then(() => {
            this.$toasted.success('Product was created', {
              position: 'top-right',
              showHideTransition: 'slide',
              icon: 'check',
              duration: 2000,
            })
            this.$Progress.finish()
            this.close()
          })
          .catch(() => {
            this.$toasted.error('Product was not created', {
              position: 'top-right',
              showHideTransition: 'slide',
              icon: 'error',
              duration: 2000,
            })
            this.$Progress.fail()
          })
      }
    },
    cancel() {
      this.close()
    },
    close() {
      if (!this.isModal) {
        this.$router.go(-1)
      } else {
        this.$emit('close')
      }
    },
    randomString(length, chars) {
      let result = ''
      for (let i = length; i > 0; --i) { // eslint-disable-line
        result += chars[Math.floor(Math.random() * chars.length)]
      }
      return result
    },
    generateSKU() {
      this.product.sku = `P${this.randomString(9, '0123456789')}`
    },
  },
  mixins: [validationMixin],
  validations: {
    product: {
      name: {
        required,
        minLength: minLength(4),
      },
      CategoryId: {
        minValue: minValue(1),
      },
      sellingPrice: {
        required,
        decimal,
      },
      upc: {
        minLength: minLength(12),
      },
      purchaseCost: {
        decimal,
      },
    },
  },
}
</script>

<style lang="scss" scoped>

.v-chip--x-small {
  font-size: 10px;
  height: 16px;
}

.v-chip--x-small .v-chip__content {
  line-height: 1;
  padding: 8px;
}
</style>

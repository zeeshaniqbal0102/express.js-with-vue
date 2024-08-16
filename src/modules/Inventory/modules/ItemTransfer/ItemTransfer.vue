<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="pa-2">
        <v-btn class="white-btn v-btn-with-radius" @click.stop.prevent="cancel">
          {{ $t('buttons.cancel') }}
        </v-btn>

        <v-btn
          color="info"
          class="v-btn-with-radius align-self-cente"
          :disabled="toSelectedProducts.length <= 0 || !toLocation"
          @click.stop.prevent="submit"
          >{{ $t('buttons.save') }}</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm5 class="pa-2">
        <v-card>
          <v-card-text class="fromItems">
            
          <LocationAutocomplete
            noSearchEntry="true"
            noClear="true"
            @selected="selectedFromLocation"
          ></LocationAutocomplete>
            <div v-if="loadingFromProducts">
              fetching products please wait
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-if="products !== null && !loadingFromProducts">
              <div v-if="products.length === 0">no products found</div>
              <ul v-if="products.length > 0">
                <li class="list-item p-2">
                  <label for>
                    product name
                    <div class="quantity-wrapper">quantity</div>
                  </label>
                </li>
                <li
                  v-for="(product, index) of filteredProducts"
                  :key="product.id"
                  class="list-item"
                >
                  <label>
                    <input
                      type="checkbox"
                      v-model="fromSelectedProducts.id[index]"
                      v-bind:value="product.id"
                    />
                    {{ product.name }}
                    <div class="quantity-input-wrapper">
                      <input
                        type="number"
                        placeholder="quantity"
                        v-model="fromSelectedProducts.quantity[index]"
                        class="quantity-input"
                        value="1"
                        required
                      />
                    </div>
                  </label>
                </li>
              </ul>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm2 text-center>
        <v-btn class="v-btn-with-radius white-btn" @click.stop.prevent="transferFrom">
          transfer
          <!-- <v-icon right>fas fa-angle-right</v-icon> -->
        </v-btn>
        <!-- <v-btn class="v-btn-with-radius white-btn" lg>
              <v-icon left>fas fa-angle-left</v-icon> transfer
        </v-btn>-->
      </v-flex>
      <v-flex xs12 sm5 class="pa-2">
        <v-card>
          <v-card-text>
            
          <LocationAutocomplete
            noClear="true"
            @selected="selectedToLocation"
            noSearchEntry="true"
          ></LocationAutocomplete>
            <div v-if="itemTrasferingLoader">
              transfering products please wait
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <v-card-text>
              <ul v-if="toSelectedProducts" class="list-items">
                <li class="list-item p-2">
                  <label for>
                    product name
                    <div class="quantity-wrapper">quantity</div>
                  </label>
                </li>
                <li
                  v-for="(product, index) of toSelectedProducts"
                  :key="product.id"
                  class="to-list-item"
                >
                  {{ product.name }} -
                  <strong>{{ product.quantity }}</strong>
                  <v-icon @click="removeFromSelected(index)" title="click to remove item"
                    >delete</v-icon
                  >
                </li>
              </ul>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import locationService from '../../../Location/service'
import productService from '../Product/service'
import LocationAutocomplete from '@/modules/Location/components/AutoComplete';

export default {
  name: 'ItemTransfer',
  data() {
    return {
      fromLocation: '',
      toLocation: '',
      search: null,
      locations: [],
      locationsTo: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      loadingFromProducts: false,
      itemTrasferingLoader: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'name',
      },
      products: null,
      filteredProducts: null,
      fromSelectedProducts: {
        id: [''],
        quantity: [''],
      },
      toSelectedProducts: [],
    }
  },
  components: {
    LocationAutocomplete
  },
  computed: {
    selectedWithquantity() {
      return this.fromSelectedProducts
    },
  },
  watch: {
    search() {
      if (this.search.length > 3 || this.search.length === 0) {
        // this.getProductForLocation() no need to hit the server again
        this.filteredProducts = this.products.filter(item => item.name.includes(this.search))
      }
    },
  },
  methods: {
    isDuplicate() {
      if (this.fromLocation && this.toLocation && this.fromLocation.id == this.toLocation.id) {
        return true
      }
      return false
    },
    selectedFromLocation(val) {
      if (val) {
        this.fromLocation = val.location;
        this.getProductForLocation()
      }
    },
    selectedToLocation(val) {
      if (val) {
        this.toLocation = val.location;
      }
    },
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return locationService
        .getAll({
          noPagination: true,
          lite: true,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then((response) => {
          this.locations = response.data
          this.locationsTo = this.locations
          this.count = response.count
          this.loading = false
          return response
        })
    },
    async getProductForLocation() {
      const locationFrom = await this.locations.find(item => item.id === this.fromLocation.id)
      this.loadingFromProducts = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return productService
        .getAll({
          // limit: this.limit,
          // offset: this.offset,
          // showBalance: true,
          search: this.search,
          orderBy: ['name', this.pagination.ascending],
          fromLocation: locationFrom.OrganizationId,
        })
        .then((response) => {
          this.products = response.data
          this.filteredProducts = this.products
          this.locationsTo = this.locations.filter(item => item.id !== this.fromLocation)
          this.loadingFromProducts = false
          return response
        })
    },
    transferFrom() {
      if (!this.fromSelectedProducts.id[0]) {
        this.$toasted.error('Choose a location from and items', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
        return false
      }
      if (this.isDuplicate()) {
        this.$toasted.error('Same Location Selected', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
        return false
      }
      // filteredProducts
      this.toSelectedProducts = Object.keys(this.fromSelectedProducts.id).reduce(
        (acc, item) => {
          if (
            !this.fromSelectedProducts.quantity[item]
            || this.fromSelectedProducts.quantity[item] <= 0
          ) {
            this.$toasted.error(
              `Quatity must be greated than 0 , for item ${
                this.filteredProducts[item].name}`,
              {
                position: 'top-center',
                showHideTransition: 'slide',
                icon: 'check',
                duration: 2000,
              },
            )
            return acc
          }
          if (this.fromSelectedProducts.id[item] && this.filteredProducts[item]) {
            acc.push({
              id: this.filteredProducts[item].id,
              name: this.filteredProducts[item].name,
              quantity: this.fromSelectedProducts.quantity[item],
            })
          }
          return acc
        },
        [],
      )
    },
    removeFromSelected(index) {
      this.$delete(this.toSelectedProducts, index)
      this.toSelectedProducts[this.toSelectedProducts.indexOf(index)] = null
    },
    submit() {
      const locationFrom = this.locations.find(item => item.id === this.fromLocation)
      const locationTo = this.locations.find(item => item.id === this.toLocation)

      const data = {
        locationFrom,
        locationTo,
        toSelectedProducts: this.toSelectedProducts,
      }
      this.itemTrasferingLoader = true
      productService
        .itemTransfer(data)
        .then((data) => {
          this.toSelectedProducts = []
          this.$toasted.success('Products transfered', {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'check',
            duration: 2000,
          })
          this.itemTrasferingLoader = false
        })
        .catch((error) => {
          console.log('error', error)
          this.$toasted.error('Products transfered FAILED', {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'check',
            duration: 2000,
          })
          this.itemTrasferingLoader = false
        })
        
      
    },
    cancel() {
      console.log('cancel fired')
    },
  },
  created() {
    this.getList()
  },
}
</script>
<style scoped>
.text-center {
  text-align: center;
}
ul {
  padding: 0;
  margin: 0;
}
.list-item {
  list-style: none;
  margin: 0;
}
.list-item label,
.to-list-item {
  display: flex;
  border-bottom: 1px dotted #ebebeb;
  margin: 10px 0;
  align-items: center;
}
input[type='checkbox'] {
  margin: 10px;
}
.quantity-wrapper {
  margin-right: 0;
  margin-left: auto;
}
.quantity-input-wrapper {
  margin-left: auto;
  margin-right: 0;
  width: 0px;
  transition: all 0.3s ease-out;
  overflow: hidden;
  background: #fff;
  padding: 5px 0;
  opacity: 0;
}
.quantity-input {
  min-height: 40px;
  max-width: 100%;
  text-align: center;
  padding: 0px;
  padding: 0 5px;
  font-size: 12px;
}

input[type='checkbox']:checked ~ .quantity-input-wrapper {
  width: 75px;
  background: #ebebeb;
  opacity: 1;
}
.to-list-item {
}
.to-list-item strong {
  margin-left: auto;
  margin-right: 0;
}
</style>
<style>
.fromItems .SearchBar {
  width: 100%;
  margin-left: 0;
  max-width: 100%;
  flex-basis: 100%;
}
</style>

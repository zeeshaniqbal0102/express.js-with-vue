<template>
  <v-container fluid>
    <SearchBar v-model="search" />
    <v-card flat class="outlined">
      <v-toolbar :color="$style.card.header" class="elevation-0">
        <v-toolbar-title>
          <v-layout column fill-height>
            <span class="title">{{ $t('pageHeader.products') }}</span>
          </v-layout>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="v-btn-with-radius white-btn" to="/inventory/product/create">
          <v-icon left small>add</v-icon>
          {{ $t('buttons.new') }}
        </v-btn>
      </v-toolbar>

      <v-data-table
        :expand="expand"
        class="table-header"
        :headers="headers"
        :items="products"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
      >
        <template slot="items" slot-scope="props">
          <tr class="pointer">
            <td class="text-xs-left large-td" @click="props.expanded = !props.expanded">
              <v-layout row>
                <span>{{ props.item.name }}</span>
                <span class="ml-2" v-if="props.item.imageURL"
                  ><v-img
                    width="40px"
                    :src="props.item.imageURL"
                    aspect-ratio="1"
                    max-height="20px"
                    contain
                  ></v-img
                ></span>
              </v-layout>
            </td>
            <td class="text-xs-left medium-td" @click="props.expanded = !props.expanded">
              {{ props.item.Category.name }}
            </td>
            <td class="text-xs-left" @click="props.expanded = !props.expanded">
              {{ props.item.GlobalStock ? props.item.GlobalStock : 'N/A' }}
            </td>
            <td class="text-xs-right" @click="props.expanded = !props.expanded">
              {{ props.item.sellingPrice | currency }}
            </td>
            <td @click="props.expanded = !props.expanded">
              <toggle-button
                disabled
                :value="props.item.active"
                :labels="true"
                :sync="true"
              ></toggle-button>
            </td>

            <td class="justify-end layout px-0">
              <v-menu bottom left offset-y>
                <v-btn slot="activator" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>

                <v-list class="menu-button">
                  <v-list-tile @click="editProduct(props.item)">
                    <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="deleteProduct(props.item)">
                    <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </template>

        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>
              <v-layout align-start justify-start row fill-height>
                <v-img
                  width="120px"
                  v-if="props.item.imageURL"
                  :src="props.item.imageURL"
                  aspect-ratio="1"
                  max-height="120px"
                  max-width="120px"
                  contain
                ></v-img>
                <v-flex class="ml-2">
                  <div>
                    {{ $t('labels.upc') }}:
                    <span class="font-weight-medium">{{
                      props.item.upc ? props.item.upc : 'N/A'
                    }}</span>
                  </div>
                  <div>
                    {{ $t('labels.cost') }}:
                    <span class="font-weight-medium">{{
                      props.item.purchaseCost | currency
                    }}</span>
                  </div>
                  <div>
                    {{ $t('labels.inventoryValuation') }}:
                    <span class="font-weight-medium">{{
                      $options.filters.currency(
                        parseFloat(props.item.purchaseCost) *
                          parseFloat(props.item.GlobalStock),
                      )
                    }}</span>
                  </div>
                  <div>
                    {{ $t('labels.totalSellingValue') }}:
                    <span class="font-weight-medium">{{
                      $options.filters.currency(
                        parseFloat(props.item.sellingPrice) *
                          parseFloat(props.item.GlobalStock),
                      )
                    }}</span>
                  </div>
                  <div>
                    {{ $t('labels.description') }}:
                    <span class="font-weight-medium">{{
                      props.item.description ? props.item.description : 'N/A'
                    }}</span>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import productService from '../service'

export default {
  name: 'product-list',
  data() {
    return {
      expand: false,
      headers: [
        {
          text: this.$t('labels.name'),
          value: 'name',
          sortable: true,
        },
        {
          text: this.$t('labels.category'),
          value: 'category',
          sortable: false,
        },
        {
          text: this.$t('labels.stock'),
          value: 'balance',
          sortable: false,
        },
        {
          text: this.$t('labels.price'),
          value: 'price',
          align: 'right',
          sortable: false,
        },
        {
          text: this.$t('labels.active'),
          value: 'active',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      products: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'name',
      },
    }
  },
  computed: {},
  watch: {
    search() {
      if (this.search.length > 3 || this.search.length === 0) {
        this.getList()
      }
    },
    pagination: {
      handler() {
        this.pagination.totalItems = this.count
        this.getList()
      },
      deep: true,
    },
  },
  methods: {
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return productService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          showBalance: true,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then((response) => {
          this.products = response.data
          this.count = response.count
          this.loading = false
          return response
        })
    },
    editProduct(product) {
      this.$router.push({ name: 'product-edit', params: product })
    },
    deleteProduct(product) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          productService.delete(product.id).then((response) => {
            if (response.data) {
              this.$swal('Deleted!', 'Product has been deleted.', 'success')
              this.getList()
            }
          })
        }
      })
    },
  },
}
</script>

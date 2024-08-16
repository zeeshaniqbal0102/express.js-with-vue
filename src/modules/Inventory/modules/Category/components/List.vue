<template>
  <v-container>
    <SearchBar v-model="search" />
    <v-card>
      <v-toolbar :color="$style.card.header" class="elevation-0">
        <v-toolbar-title>
          <v-layout column fill-height>
            <span class="title">{{ $t('pageHeader.category') }}</span>
          </v-layout>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="v-btn-with-radius white-btn" @click="openCreateCategory">
          <v-icon left small>add</v-icon>
          {{ $t('buttons.new') }}
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="categories"
        class="table-header"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.productCount }}</td>

          <td class="text-xs-left">
            <v-tooltip top max-width="200">
              <span slot="activator">{{ props.item.MasterCategory.name }}</span>
              <span class="pa-3">{{ props.item.MasterCategory.description }}</span>
            </v-tooltip>
          </td>

          <td class="justify-end layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list class="menu-button">
                <v-list-tile @click="openEditCategory(props.item)">
                  <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="deleteCategory(props.item)">
                  <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="createDialog" max-width="550">
        <create
          isModal="true"
          v-on:close="closeCreateCategory"
          :searchText="search"
        ></create>
      </v-dialog>
      <v-dialog v-if="editModel" v-model="editModel" max-width="550">
        <edit
          :isModal="true"
          :id="editModel.id"
          v-on:close="editModel = null"
          :searchText="search"
        ></edit>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import categoryService from '../service'

const Create = () => import('./Create')
const Edit = () => import('./Edit')

export default {
  name: 'category-list',
  data() {
    return {
      createDialog: false,
      editModel: null,
      headers: [
        {
          text: this.$t('labels.name'),
          value: 'name',
          sortable: false,
        },
        {
          text: this.$t('labels.productCount'),
          value: 'productCount',
          sortable: false,
        },
        {
          text: this.$t('labels.masterCategory'),
          value: 'MasterCategory',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      categories: [],
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
  components: {
    Create,
    Edit,
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
    openCreateCategory() {
      this.createDialog = true
    },
    closeCreateCategory(newCategory) {
      this.createDialog = false
    },
    openEditCategory(category) {
      this.editModel = category
    },
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return categoryService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
          includeStock: true,
          includeProducts: true,
        })
        .then(response => {
          this.categories = response.data
          this.count = response.count
          this.loading = false
          return response
        })
    },
    deleteCategory(category) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.value) {
          this.$Progress.start()
          return categoryService
            .delete(category.id)
            .then(response => {
              if (response.data) {
                this.$swal('Deleted!', 'Category has been deleted.', 'success')
                this.$Progress.finish()
                this.getList()
              }
            })
            .catch(error => {
              this.$toasted.error(error.data.message, {
                position: 'top-right',
                showHideTransition: 'slide',
                icon: 'error',
                duration: 5000,
              })
              this.$Progress.fail()
            })
        }
      })
    },
  },
}
</script>

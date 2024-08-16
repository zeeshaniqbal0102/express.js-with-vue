<template>
  <v-container fluid>
    <SearchBar v-model="search" />
    <v-card flat class="outlined" :color="$style.card.background">
      <ListTitle
        :title="$t('pageHeader.role')"
        @new="$router.push({ path: '/employee/role/create' })"
      />

      <v-data-table
        :headers="headers"
        :items="roles"
        class="table-header"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.createdAt | moment('L LT') }}</td>
          <td class="text-xs-left">{{ props.item.updatedAt | moment('L LT') }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>

          <td class="justify-end layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list class="menu-button">
                <v-list-tile @click="editRole(props.item)">
                  <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="deleteRole(props.item)">
                  <v-list-tile-title>{{ $t('buttons.delete') }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import roleService from '../service'

export default {
  name: 'role-list',
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.createdAt'),
          value: 'createdAt',
          sortable: false,
          width: '25%',
        },
        {
          text: this.$t('labels.lastModify'),
          value: 'updatedAt',
          sortable: false,
          width: '25%',
        },
        {
          text: this.$t('labels.name'),
          value: 'name',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
        },
      ],
      search: null,
      roles: [],
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
  computed: {
    clearIcon() {
      let icon = null
      if (this.search && this.search.length === 0) {
        icon = 'clear'
      } else {
        icon = 'search'
      }
      return icon
    },
  },
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
    clear() {
      console.log('clear button press')
    },
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return roleService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then(response => {
          console.log('response', response)
          this.roles = response.data
          this.count = response.count
          this.loading = false
          return response
        })
    },
    editRole(role) {
      this.$router.push({ name: 'employee-role-edit', params: role })
    },
    deleteRole(role) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('buttons.yes'),
        cancelButtonText: this.$t('buttons.no'),
      }).then(result => {
        if (result.value) {
          this.$Progress.start()
          return roleService
            .delete(role.id)
            .then(response => {
              if (response.data) {
                this.$swal('Deleted!', 'Role has been deleted.', 'success')
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

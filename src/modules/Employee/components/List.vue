<template>
  <v-container fluid>
    <SearchBar v-model="search" />
    <v-card flat class="outlined" :color="$style.card.background">
      <ListTitle
        :title="$t('pageHeader.employee')"
        @new="$router.push({ path: 'create' })"
      />
      <v-data-table
          :headers="headers"
          class="table-header"
          :items="employees"
          :pagination.sync="pagination"
          :total-items="count"
          :loading="loading"
          :rows-per-page-items="rowsPerPageItems"
          expand
         >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{
                    props.item.createdAt | moment('L LT')
                  }}</span>
                </template>
                <span>{{ props.item.createdAt | moment('L LT') }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left small-td">{{ props.item.firstName }}</td>
            <td class="text-xs-left small-td">{{ props.item.lastName }}</td>
            <td class="text-xs-left">
              {{ props.item.phoneNumber ? props.item.phoneNumber : 'N/A' }}
            </td>
            <td class="text-xs-left">
              {{ props.item.email ? props.item.email : 'N/A' }}
            </td>
            <td class="justify-center layout px-0">
              <v-menu bottom left offset-y>
                <v-btn slot="activator" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>

                <v-list class="menu-button">
                  <v-list-tile @click="editemployee(props.item)">
                    <v-list-tile-title>{{ $t('buttons.edit') }}</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="deleteemployee(props.item)" v-if="!LocationId">
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
import employeeService from '../service'

export default {
  name: 'employee-list',
  props: ['LocationId', 'hideHeader', 'hideCreate'],
  data() {
    return {
      headers: [
        {
          text: this.$t('labels.createdAt'),
          value: 'createdAt',
          sortable: false,
        },
        {
          text: this.$t('labels.firstName'),
          value: 'firstName',
          sortable: false,
        },
        {
          text: this.$t('labels.lastName'),
          value: 'lastName',
          sortable: false,
        },
        {
          text: this.$t('labels.phoneNumber'),
          value: 'phoneNumber',
          sortable: false,
        },
        {
          text: this.$t('labels.emailAddress'),
          value: 'email',
          sortable: false,
        },
        {
          text: '',
          value: 'action',
          sortable: false,
				},
      ],
      search: null,
      employees: [],
      count: 0,
      limit: 10,
      offset: 0,
      loading: false,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 10,
        sortBy: 'firstName',
      },
    }
  },
  created() {
    this.getList()
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
      return employeeService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          local: true,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
          LocationId: this.LocationId,
        })
        .then(response => {
          this.employees = response.data
          this.count = response.count
          this.loading = false
          return response
        })
    },
    editemployee(employee) {
      this.$router.push({ name: 'employee-edit', params: employee })
    },
    deleteemployee(employee) {
      this.$swal({
        title: this.$t('messages.title.areYouSure'),
        text: this.$t('messages.text.youWontBeAbleToRevert'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: this.$t('buttons.yesDeleteIt'),
      })
        .then(result => {
          if (result.value) {
            employeeService.delete(employee.id).then(response => {
              if (response.data) {
                this.$swal(
                  this.$t('messages.title.deleted'),
                  this.$t('messages.text.employeeHasDelete'),
                  'success',
                )
                this.getList()
              }
            })
          }
        })
        .catch(error => {
          // todo present this to the user
          console.log(error)
        })
    },
  },
}
</script>

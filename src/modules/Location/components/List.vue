<template>
  <v-container fluid>
    <SearchBar v-model="search" />
    <v-card flat class="outlined" :color="$style.card.background">
      <ListTitle
        data-cy="locationComponentListNewBtn"
        :title="$t('pageHeader.location')"
        @new="$router.push({ path: 'create' })"
      />

      <v-card-text v-if="locations.length === 0">
        <CSPLoader model />
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="locations"
        :pagination.sync="pagination"
        :total-items="count"
        :loading="loading"
        class="table-header"
        :rows-per-page-items="rowsPerPageItems"
        expand
      >
        <template slot="items" slot-scope="props">
          <td            
            data-cy="locationComponentListCode"
            class="text-xs-left"
          >
            {{ props.item.code }}
          </td>
          <td
            data-cy="locationComponentListName"
            class="text-xs-left large-td"
            v-html="$options.filters.highlight(props.item.name, search)"
          >
            {{ props.item.name }}
          </td>
          <td
            data-cy="locationComponentListPhone"
            v-html="$options.filters.highlight(props.item.Address.phoneNumber, search)"
            class="text-xs-left large-td hidden-xs-only"
          >
            {{ props.item.Address.phoneNumber }}
          </td>
          <td
            data-cy="locationComponentListAddress"
            class="text-xs-left large-td"
            v-html="$options.filters.highlight(props.item.Address.addressLine1, search)"
          >
            {{ props.item.Address.addressLine1 }}
          </td>
          <td
            data-cy="locationComponentListCity"
            class="text-xs-left large-td hidden-xs-only"
            v-html="$options.filters.highlight(props.item.Address.city, search)"
          >
            {{ props.item.Address.city }}
          </td>
          <td class="justify-end layout px-0">
            <v-menu bottom left offset-y>
              <v-btn slot="activator" icon>
                <v-icon data-cy="locationComponentListMoreOption">more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile
                  data-cy="locationComponentListView"
                  @click="viewLocation(props.item)"
                >
                  <v-list-tile-title>{{ $t('buttons.view') }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  data-cy="locationComponentListOpenTerminal"
                  :href="`${terminalURL}/login/location?code=${props.item.code}`"
                  target="_blank"
                >
                  <v-list-tile-title>{{ $t('buttons.openTerminal') }}</v-list-tile-title>
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
import locationService from '../service.js'

export default {
  name: 'location-list',
  data() {
    return {
      terminalURL: process.env.VUE_APP_TERMINALURL,
      clientName: process.env.VUE_APP_CLIENT_NAME,
      search: null,
      locations: [],
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
    headers() {
      const headers = []
      if (!this.$vuetify.breakpoint.xs) {
        headers.push(
          {
            text: this.$t('labels.code'),
            align: 'left',
            sortable: true,
            value: 'code',
            width: '10%',
          },
          {
            text: this.$t('labels.name'),
            value: 'name',
            sortable: true,
          },
          {
            text: this.$t('labels.phoneNumber'),
            value: 'Address.phoneNumber',
            sortable: false,
          },
          {
            text: this.$t('labels.address'),
            value: 'Address.addressLine1',
            sortable: false,
          },
          {
            text: this.$t('labels.city'),
            value: 'Address.city',
            sortable: false,
          },
          {
            text: '',
            value: 'action',
            sortable: false,
          },
        )
      } else {
        headers.push(
          {
            text: this.$t('labels.code'),
            align: 'left',
            sortable: true,
            value: 'code',
            width: '10%',
          },
          {
            text: this.$t('labels.name'),
            value: 'name',
            sortable: true,
          },
          {
            text: this.$t('labels.address'),
            value: 'Address.addressLine1',
            sortable: false,
          },
          {
            text: '',
            value: 'action',
            sortable: false,
          },
        )
      }
      return headers
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
    getList() {
      this.loading = true
      const { page, rowsPerPage } = this.pagination
      if (rowsPerPage > 0) {
        this.offset = rowsPerPage * page - rowsPerPage
      }
      this.limit = rowsPerPage
      return locationService
        .getAll({
          limit: this.limit,
          offset: this.offset,
          search: this.search,
          orderBy: [this.pagination.sortBy, this.pagination.descending],
        })
        .then(response => {
          this.locations = response.data
          console.log('locations', this.locations)
          this.count = response.count
          this.loading = false
          return response
        })
    },
    viewLocation(location) {
      this.$router.push({ path: `/location/${location.id}/profile` })
    },
  },
}
</script>
<style lang="scss" scoped>
.newLocationCard {
  text-align: center;
  background-color: #e37475;
  color: white;
  font-weight: 500;
}
</style>

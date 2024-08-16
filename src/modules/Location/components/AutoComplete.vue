<template>
  <div>
    <v-autocomplete
      ref="search"
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"

      hide-no-data
      solo
      no-filter
      autocomplete
      item-text="name"
      item-value="id"
      label="Location Search"
      :placeholder="placeholder || 'Start typing to Search'"
      return-object
      :error-messages="errorMessages"
    >
      <template slot="item" slot-scope="{ item }">
        <v-list-tile-content>
          <v-list-tile-title v-text="item.name"></v-list-tile-title>
        </v-list-tile-content>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
import _ from 'lodash';
import locationService from '../service.js'

export default {
  name: 'location-autocomplete',
  components: {
  },
  props: {
    searchText: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    noClear: {
      type: String,
    },
    errorMessages: {
      type: Array,
    },
    noSearchEntry: {
      type: String
    }
  },
  data() {
    return {
      search: null,
      entries: [],
      isLoading: false,
      model: null,
    };
  },
  computed: {
    fields() {
      if (!this.model) return [];
      return Object.keys(this.model).map((key) => {
        console.log(key);
        return {
          key,
          value: this.model[key] || 'n/a',
        };
      });
    },
    items() {
      return this.entries.map(entry => entry);
    },
  },
  methods: {
    returnResult(val, auto = false) {
      // this.search = null
      if (!this.noClear || auto) {
        this.model = null;
        this.entries = [];
      }
      this.$emit('selected', { location: val, autoEnter: auto });
    },
  },
  watch: {
    search: _.debounce(function (val) {
      // Min val
      if (!val || val.length < 1) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;
      // Lazily load input items
      locationService
        .getAll({
          limit: 30,
          search: val.trim(),
        })
        .then((response) => {
          const { count, data } = response;
          this.count = count;
          this.entries = data;
          this.isLoading = false;
          if (
            this.entries.length === 0
            && this.search
            && !this.isLoading
            && this.search.length >= 3
            && !this.noSearchEntry
          ) {
            this.entries.push({ name: this.search });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 300),
    model(val) {
      if (val) {
        this.returnResult(val);
        if (!this.noClear) {
          this.model = null;
          this.search = null;
          this.entries = [];
        }
      }
    },
  },
};
</script>
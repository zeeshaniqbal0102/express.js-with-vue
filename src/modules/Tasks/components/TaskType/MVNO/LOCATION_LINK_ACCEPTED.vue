<template>
  <v-card>
    <v-card-text>
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(organization,i) in Organizations"
          :key="i"
        >
          <div slot="header">{{ organization.name }}</div>
          <v-card>
            <v-container>
              <v-checkbox v-model="location.apply" v-for="location in organization.Locations" :label="location.name" :value="location.id" :key="location.id"></v-checkbox>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="green darken-1"
        flat="flat"
        @click="done"
      >
        Cancel
      </v-btn>
      <v-btn
        color="green darken-1"
        flat="flat"
        @click="reject"
      >
        Reject
      </v-btn>

      <v-btn
        color="green darken-1"
        flat="flat"
        @click="accept"
      >
        Accept
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import userService from '../../../../User/service.js'
import taskService from '../../../service.js'

export default {
  name: 'tasks-type-MVNO-LOCATION_LINK_ACCEPTED',
  props: ['task'],
  created() {
    // Get the list of locations, and organizations for this user
    userService.getCurrent({ includeOrganizations: true, includeLocations: true })
      .then((response) => {
        console.log(response.data)
        if (response.data.Organizations) {
          Promise.all(response.data.Organizations.map(async (organization) => {
            if (organization.Locations) {
              await Promise.all(organization.Locations.map((location) => {
                location.apply = false
              }))
            }
            this.Organizations.push(organization)
          }))
        }
      })
    // Add a checkbox to each location
    // Somehow check if the location already has accepted so we don't accept it again
    // return the accepted array of locations
  },
  data() {
    return {
      isLoading: false,
      Organizations: [],
      selected: [],
    }
  },
  methods: {
    async accept() {
      this.isLoading = true
      await Promise.all(this.Organizations.map(async (organization) => {
        if (organization.Locations) {
          await Promise.all(organization.Locations.map((location) => {
            if (location.apply) this.selected.push(location)
          }))
        }
        this.Organizations.push(organization)
      }))
      await taskService.acceptTask(this.task.id, { Locations: this.selected })
        .then((response) => {
          this.isLoading = false
          this.done()
        })
        .catch((error) => {
          console.log(error)
        })

      // this.done()
    },
    reject() {
      return taskService.rejectTask(this.task.id)
        .then((response) => {
          this.isLoading = false
          this.done()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    done() {
      this.$emit('done')
    },
  },
}
</script>

<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="500">
     <v-badge left slot="activator" overlap>
      <span slot="badge" v-if="tasks.length > 0" >{{ tasks.length }}</span>
      <v-btn
        flat
        small
        class="ma-0">
        {{ $t('buttons.tasks') }}
      </v-btn>
    </v-badge>


      <v-card>
        <v-card-title
          primary-title>
          {{ $t('pageHeader.pendingTasks') }}
        </v-card-title>

        <v-card-text>
          <v-list two-line v-if="tasks.length > 0">
            <template v-for="(item, index) in tasks">

              <v-divider
                v-if="item.divider"
                :inset="item.inset"
                :key="index"
              ></v-divider>

              <v-list-tile
                v-else
                :key="index"
                avatar
                @click="openTask(item, index)"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.message"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <div v-else>
            Task list is empty.
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <task-view :task="selectedTask" v-on:done="closeTask"></task-view>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import TaskView from './TaskView'

export default {
  name: 'tasks-button',
  components: {
    TaskView,
  },
  data() {
    return {
      dialog: false,
      selectedTask: null,
    }
  },
  computed: {
    ...mapGetters('tasks', ['tasks']),
  },
  methods: {
    ...mapActions('tasks', ['initTasks']),
    openTask(val) {
      this.selectedTask = val
    },
    closeTask() {
      this.selectedTask = false
      this.initTasks()
    },
  },
  watch: {
    dialog() {
      this.initTasks()
    },
  },
}
</script>

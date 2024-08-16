<template>
  <v-dialog
      v-model="dialog"
      max-width="290"
      persistent
    >
      <v-card v-if="task">
        <v-card-title class="headline">{{ task.title }}</v-card-title>

        <v-card-text>
          {{ task.body }}
        </v-card-text>

        <component :is="taskType" :task="task" v-on:done="done"></component>

      </v-card>
    </v-dialog>
</template>
<script>
// Imported Types
import MVNO from './TaskType/MVNO/index.vue'

export default {
  name: 'task-task-view',
  props: ['task'],
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    done() {
      this.$emit('done')
    },
  },
  watch: {
    task(val) {
      if (val) {
        this.dialog = true
      } else {
        this.dialog = false
      }
    },
  },
  computed: {
    taskType() {
      switch (this.task.acceptHook.substr(0, this.task.acceptHook.indexOf('.'))) {
        case 'MVNO':
          return MVNO
          break
      }
    },
  },
}
</script>

<template>
  <div>
    <component :is="event" :task="task" v-on:done="done"></component>
  </div>
</template>
<script>
import LOCATION_LINK_ACCEPTED from './LOCATION_LINK_ACCEPTED'

export default {
  name: 'task-type-MVNO',
  props: ['task'],
  created() {
    console.log('mvno got tasks')
  },
  methods: {
    done() {
      this.$emit('done')
    },
  },
  computed: {
    event() {
      switch (this.task.acceptHook.substr(this.task.acceptHook.indexOf('.') + 1, this.task.acceptHook.length)) {
        case 'LOCATION_LINK_ACCEPTED':
          return LOCATION_LINK_ACCEPTED
          break
      }
    },
  },
}
</script>

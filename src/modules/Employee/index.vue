<template>
  <router-view></router-view>
</template>
<script>
import RegisterStoreModule from '@/mixins/RegisterStoreModule'
import employeeState from './store'

export default {
  name: 'employee',
  mixins: [RegisterStoreModule],
  data() {
    return {}
  },
}
</script>

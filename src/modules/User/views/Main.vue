<template>
  <div>
    <v-flex class="mb-3">
      <list hideCreate=true></list>
    </v-flex>
    <v-divider/>
    <invite></invite>
  </div>
</template>
<script>
import List from '../components/List'
import Invite from '../components/Invite'

export default {
  name: 'user-views-main',
  components: {
    List,
    Invite,
  },
}
</script>

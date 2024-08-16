<template>
  <location-list></location-list>
</template>
<script>
import LocationList from '../components/List'

export default {
  name: 'location-view-dashboard',
  components: {
    LocationList,
  },
  data() {
    return {
      locationCount: 0,
    }
  },
}
</script>

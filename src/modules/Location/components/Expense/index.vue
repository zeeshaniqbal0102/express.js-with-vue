<template>
  <v-container>
    <LightSetting :locationIntegration="locationIntegration" :LocationId="LocationId"></LightSetting>
  </v-container>
</template>
<script>
import { mapGetters} from 'vuex';
import LightSetting from './LightSetting'
export default {
  name: 'location-expense',
  components: {
    LightSetting
  },
  data() {
    return {
      dialog: false,
      dynamicComponent: null,
    }
  },
  props: {
    locationIntegration: {
      type: Object,
      required: true
    },
    LocationId: {
      type: Number
    },
    location: {
      type: Object
    }
  },
  computed: {
    ...mapGetters('integration', ['locationModules', 'modules']),
  },
}
</script>

<template>
  <lottie
    :height="height"
    :width="width" :class="{model: model, fullscreen: !model}"
    :options="defaultOptions"
    v-on:animCreated="handleAnimation"
  />
</template>
<script>
import Lottie from './lottie';
import * as animationData from '../assets/lottie/cspLogo.json';

export default {
  props:{
    model: {
      type: Boolean,
      default: false,
    }
  },
  name: "loading-dialog",
  components: {
    Lottie,
  },
  data() {
    return {
      height: 100,
      width: 100,
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
    };
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim;
    },
  },
};
</script>

<style lang="scss" scoped>
  .fullscreen {
    position: absolute;
    top: 45vh;
    left: 45vw;
  }
  .model {
    top: 45vh;
    left: 45vw;
  }
</style>

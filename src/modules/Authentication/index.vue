<template>
  <v-container fluid id="login" style="overflow=hidden">
    <!-- <CSPLoader :loading="serverPresent === 'false'" text="Waiting for Server...."></CSPLoader> -->
    <v-layout align-center justify-center column fill-height>
      <div class="display-1 mb-2 font-weight-regular" style="color: black;">
        <v-layout row wrap>
          <v-flex shrink>
            <img src="../../assets/logo.png" width="45" />
          </v-flex>
          <v-flex mt-2>
            <span>CELL</span>
            <span class="font-weight-black" style="color: #F3751D;">SMART</span>
          </v-flex>
        </v-layout>
      </div>
      <div>
        <span class="body-2">{{ $t('pageHeader.backOffice') }}</span>
      </div>
      <router-view class="mt-4" />
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'authentication',
}
</script>
<style scoped>
#login {
  background-color: #ebedf1;
}
</style>

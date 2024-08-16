<template>
  <div>
    <v-container>
      test
    <v-btn @click="print">Print</v-btn>
      <iframe id="printf" src="/receipt" frameborder="0" height="812px" width="375"></iframe>
    </v-container>
  </div>
</template>
<script>
export default {
  methods: {
    print() {
      const frm = document.getElementById('printf').contentWindow;
      frm.focus();// focus on contentWindow is needed on some ie versions
      frm.print();
    },
  },
}
</script>

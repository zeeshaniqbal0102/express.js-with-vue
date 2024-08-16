<template>
  <v-layout column="">
    <v-card height="100px" color="green" dark class="border-r-0">
      <v-card-text class="text-xs-center">
        <h1>Reports</h1>
        <h4>Real time data at your fingertips</h4>
      </v-card-text>
    </v-card>
    <v-container>
    <v-layout column>
      <v-flex class="text-xs-center">
        <h4>If you would like to see reports for an individual store visit the store profile.</h4>
      </v-flex>
      <v-btn to="/location/dashboard">Store List</v-btn>
    </v-layout>
    <v-layout row>  
      <v-flex xs12 sm4>
        <v-card hover to="sales">
          <v-card-text>
            <h3>Sales Summary</h3>
            <p>View a summary of your sales by location and by employees</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 ml-2>
        <v-card hover to="timeClock">
          <v-card-text>
            <h3>TimeClock Summary</h3>
            <p>View a summary of timeClock by location and by employees</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  </v-layout>

</template>
<script>
export default {
  name: 'reports-home',
}
</script>

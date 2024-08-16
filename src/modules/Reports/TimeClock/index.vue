<template>
<v-container class="align-center" fill-height max-width="200">
    <div class="text-xs-center" >
      <v-flex  >
        <v-card class="rounded">
          <v-card-title>
            Please select Employee to generate TimeClock report
          </v-card-title>
        </v-card>
         <EmployeeAutocomplete
            noClear="true"
            @selected="selectedEmployee"
          ></EmployeeAutocomplete>
        <v-card-text v-if="employee">
          <v-btn @click="generateReport">
            Generate
          </v-btn>
        </v-card-text>
      </v-flex>
    </div>
</v-container>
</template>
<script>
import employeeService from '../../Employee/service.js'
import EmployeeAutocomplete from '@/modules/Employee/components/AutoComplete';

export default {
  name: 'reports-timeClock',
  components: {
    EmployeeAutocomplete
  },
  data() {
    return {
      employees: [],
      employee: false
    }
  },
  async created() {
    
    this.employees = (await employeeService.getAll({ lite: true })).data
  },
  methods: {
    selectedEmployee(val) {
      if (val) {
        this.employee = val.employee;
      }
    },
    generateReport() {
      if (this.$route.params && this.$route.params.LocationId) {
        
        this.$router.push({
          name: "reports-timeClock-list",
          params: { 
            EmployeeId: this.employee.id,
            LocationId: this.$route.params.LocationId
          }
        })
      } else {
        
        this.$router.push({
          name: "reports-timeClock-list",
          params: { EmployeeId: this.employee.id }
        })
      }
    }
  }
}
</script>

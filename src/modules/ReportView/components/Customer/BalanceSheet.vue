<template>
  <div class="invoice-view">
    <v-card flat v-if="isLoading">
      <v-card-text>
        <v-progress-linear :indeterminate="true"></v-progress-linear>
      </v-card-text>
    </v-card>
    <div v-else>
      <v-card flat>
        <ReportViewBar v-if="Customer" :title="`Balance Sheet`" />

        <v-container fluid>
          <table class="center">
            <!-- <v-divider class="mx-3"></v-divider> -->
            <tbody class="report-container">
              <v-card-text class="pt-0">
                <v-data-table
                  :headers="headers"
                  :items="Customer"
                  dense
                  :pagination.sync="pagination"
                  :total-items="count"
                  :loading="isLoading"
                  :rows-per-page-items="rowsPerPageItems"
                  hide-actions
                  expand
                >
                  <template slot="items" slot-scope="props">
                    <tr data-cy="customerListRows" class="pointer">
                      <td class="text-xs-left">{{ props.item.fullName }}</td>
                      <td class="text-xs-left">{{ props.item.phoneNumber }}</td>
                      <td class="text-xs-right">
                        {{ props.item.CustomerInfos[0].account | currency }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </tbody>
          </table>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import ReportViewBar from '@/components/ReportViewBar';
import customerList from '@/modules/Customer/service';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      showEmailBtn: false,
      isLoading: true,
      count: 0,
      Customer: null,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 50,
        sortBy: 'fullName',
      },
      headers: [
        {
          text: 'CUSTOMER NAME',
          align: 'left',
          value: 'fullName',
          sortable: false,
        },
        {
          text: 'PHONE NUMBER',
          align: 'left',
          value: 'name',
          sortable: false,
        },
        {
          text: 'BALANCE',
          align: 'right',
          value: 'balance',
          sortable: false,
        },
      ],
      totalQty: 0,
    };
  },
  computed: {
    ...mapGetters('global', ['currentBusiness']),
  },
  created() {
    this.loadData();
    if (!this.currentBusiness) this.initEmployee();
  },
  components: { ReportViewBar },
  methods: {
    ...mapActions('global', ['initEmployee']),
    color(item) {
      let color = 'black';
      if (item.balance < 0) {
        color = 'red';
      }
      return color;
    },
    loadData() {
      return customerList.getAllWithBalance().then(response => {
        console.log('getAllWithBalance', response);
        this.Customer = response.data.Customers
        document.title = 'Report - Balance Sheet';
        this.count = response.data.Customers.length
        this.isLoading = false;
      });
    },
  },
};
</script>

<style scoped>
@media print {
  container {
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
  .no-print {
    display: none;
  }
  .detailBox {
    overflow: visible;
    height: 100%;
  }
  * {
    background: 0 0 !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
.paidImg {
  position: absolute;
  left: 40%;
  top: 10%;
}

.signature {
  margin-top: 100px;
}
.center {
  background-color: white;
  margin: auto;
  width: 100%;
}
/* @media print {
  .detailBox * {
    overflow: visible;
    height: 100%;
    page-break-before: always;
  }
}
.detailBox {
  overflow: auto;
  height: 600px;
} */
</style>

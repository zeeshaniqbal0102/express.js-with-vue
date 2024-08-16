<template>
  <div class="invoice-view">
    <v-card flat>
      <ReportViewBar v-if="Customer" :title="`Customer List`" />

      <v-container fluid>
        <table class="center">
          <tbody class="report-container">
            <v-card-text class="pt-0">
              <v-data-table
                :headers="headers"
                :items="Customer"
                dense
                :pagination.sync="pagination"
                :total-items="count"
                :loading="loading"
                :rows-per-page-items="rowsPerPageItems"
                hide-actions
                expand
              >
                <template slot="items" slot-scope="props">
                  <tr data-cy="customerListRows" class="pointer">
                    <td class="text-xs-left">
                      {{ props.item.createdAt | moment('MMM DD, YYYY hh:mm A') }}
                    </td>
                    <td class="text-xs-left">{{ props.item.fullName }}</td>
                    <td class="text-xs-left">{{ props.item.phoneNumber }}</td>
                    <td class="text-xs-left">{{ props.item.email }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </tbody>
        </table>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import ReportViewBar from '@/components/ReportViewBar';
import customerList from '@/modules/Contact/service.js';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      showEmailBtn: false,
      Customer: [],
      count: 0,
      loading: true,
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 50,
        sortBy: 'name',
      },
      headers: [
        {
          text: 'CREATED AT',
          align: 'left',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: 'CUSTOMER NAME',
          align: 'left',
          value: 'fullName',
          sortable: true,
        },

        {
          text: 'PHONE NUMBER',
          align: 'left',
          value: 'address',
          sortable: true,
        },
        {
          text: 'EMAIL ADDRESS',
          align: 'left',
          value: 'email',
          sortable: true,
        },
      ],
      totalQty: 0,
    };
  },
  computed: {
    ...mapGetters('global', ['location']),
  },
  created() {
    this.loadData();
    if (!this.location) this.initEmployee();
  },
  components: { ReportViewBar },
  methods: {
    ...mapActions('global', ['initEmployee']),
    loadData() {
      // const id = hashids.decode(this.$route.params.id);
      const where = {
        start: this.start,
        end: this.end,
      };
      return customerList.getAll(where).then(response => {
        console.log('response', response);
        this.Customer = response.data;
        this.pagination.rowsPerPage = this.Customer.length;
        document.title = 'Report - Customer List';

        this.loading = false;
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

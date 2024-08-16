<template>
  <div class="text-center">
    <v-dialog persistent v-model="dialog" width="500">
      <v-card :color="$style.card.background">
        <CardToolbar
          title="Select Date" isModal='true'
          @cancel="setDateSelector(false)"
        />
        <!-- <ModelTitle title="Select Date" @close="setDateSelector(false)" /> -->

        <v-container grid-list-lg>
          <!-- <VueCtkDateTimePicker
            v-model="dateTime"
            inline
            range
            :onlyDate="true"
            formatted="MM/DD/YYYY"
          /> -->
          <DateTimePicker
            defaultRange="thisMonth"
            :range="true"
            :hideTime="true"
            v-model="dateTime"
          />
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="createReport()">
            Create Report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

const DateTimePicker = () => import('@/components/DateTimePicker');

export default {
  props: ['CustomerId'],
  data() {
    return {
      dialog: false,
      dateTime: {
        start: this.$moment()
          .startOf('month')
          .toISOString(),
        end: this.$moment()
          .endOf('month')
          .toISOString(),
      },
    };
  },
  watch: {
    dateSelector(val) {
      console.log('change happend')
      this.dialog = val;
    },
  },
  computed: {
    ...mapGetters('reportView', ['getDateSelector']),
    dateSelector: {
      get() {
        return this.getDateSelector;
      },
      set(val) {
        this.setDateSelector(val);
      },
    },
  },
  components: {
    DateTimePicker,
  },
  methods: {
    ...mapActions('reportView', ['setDateSelector']),
    createReport() {
      this.$emit('submit', this.dateTime);
      this.setDateSelector(false);
    },
  },
};
</script>

<style scoped></style>

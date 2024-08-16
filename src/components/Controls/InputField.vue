<template>
  <div>
    <v-text-field
      :label="label"
      :type="type"
      :error-messages="errorMessages"
      :hide-details="hideDetails"
      :readonly="readonly"
      reverse v-model="amount"
      @input="updateValue()"
      solo @focus="$event.target.select()"
      ref="inputFieldKeyPad"
      append-icon="fas fa-calculator"
      @click:append="openKeypadAmount()"
    ></v-text-field>
    <v-dialog v-model="dialog" style="overflow: overlay;" persistent max-width="450px">
      <v-card style="height: 600px" color="#F6F9FC">
        <v-toolbar class="elevation-0">
          <v-toolbar-title class="subheading">{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop.prevent="cancel">
            <v-icon small>close</v-icon>
          </v-btn>
        </v-toolbar>
        <Keypad
          v-if="dialog"
          style="height: 533px;"
          :initValue="value"
          :hideMode="true"
          :reverse="reverse"
          :currency="currency"
          :private="private"
          :isInteger="isInteger"
          :hideQuantity="true"
          v-model="keypad"
        >
          <template slot="action">
            <v-flex xs4 class="numberKey pa-0">
              <v-btn class="tile" style="background: #ff6767" dark flat @click.stop.prevent="cancel">
                <v-flex>
                  <v-layout column>
                    <v-flex class="text-capitalize">{{ $t("buttons.cancel") }}</v-flex>
                  </v-layout>
                </v-flex>
                <!-- <v-flex hidden-xs-only>Add Without Tax</v-flex> -->
              </v-btn>
            </v-flex>
            <!-- <div style="border: solid 1px;"></div> -->
            <v-flex class="numberKey pa-0">
              <v-btn class="tile" style="background: #008000" dark flat @click.stop.prevent="submit">
                <v-flex>
                  <v-layout column>
                    <v-flex class="text-capitalize">{{ $t('buttons.enter') }}</v-flex>
                  </v-layout>
                </v-flex>
                <!-- <v-flex hidden-xs-only>Add With Tax</v-flex> -->
              </v-btn>
            </v-flex>
          </template>
        </Keypad>
      </v-card>
    </v-dialog>
    <!-- <Keypad
      :initValue="value"
      :hideMode="hideMode"
      :reverse="reverse"
      :private="private"
      :currency="currency"
      :isInteger="isInteger"
      :amountDialog="keypadDialog"
      :title="title"
      :number="number"
      :confirmLabel="$t('buttons.enter')"
      @submit="setPayment"
      @cancel="keypadDialog = false"
    /> -->
  </div>
</template>

<script>
import Keypad from "@/modules/TouchTools/Keypad/index";
export default {
  props: [
    "type",
    "errorMessages",
    "hideDetails",
    "readonly",
    "value",
    "label",
    "hideMode",
    "number",
    "currency",
    "currentAmount",
    "currency",
    "confirmLabel",
    "private",
    "amountDialog",
    "submitOnConfirm",
    "isInteger",
    "title",
    "reverse"
  ],
  data() {
    return {
      quantity: 1,
      amount: 0,
      keypad: {
        value: 0,
        quantity: 0
      },
      dialog: false,
    };
  },
  components: {
    Keypad
  },
  created() {
    this.amount = this.value
  },
  watch: {
    value(val) {
      this.amount = val
    }
  },
  methods: {
    updateValue() {
      this.$emit("input", this.amount);
    },
    submit() {
      console.log(this.keypad);
      // this.$emit("submit", this.keypad.value);
      this.amount = this.keypad.value
      this.updateValue()
      this.resetDialog()
    },
    setPayment(val) {
      console.log(val);
      // const amount = new Decimal(val);
      // const due = new Decimal(this.dueAmount);

      // this.selectedPayment.amount = amount.toFixed(2);
      // this.selectedPayment.tender = amount.toFixed(2);

      // this.keypadDialog = false;
      // this.dialogSelectPaymentSave();
    },
    async openKeypadAmount() {
      this.dialog = true;
    },
    dialogSelectPaymentSave() {
      // const amount = new Decimal(this.selectedPayment.amount);
      // const due = new Decimal(this.dueAmount);

      // console.log('Amount', amount.toFixed(2));
      // console.log(due.greaterThan(amount) ? amount.toFixed(2) : due.toFixed(2))
      // console.log(due.toFixed(2))

      // this.submitPayment({
      //   name: this.selectedPayment.name,
      //   PaymentMethodId: this.selectedPayment.id,
      //   amount: due.absoluteValue().greaterThan(amount.absoluteValue()) ? amount.toFixed(2) : due.toFixed(2),
      //   tender: new Decimal(this.selectedPayment.tender).toFixed(2),
      //   surcharge: this.selectedPayment.surcharge,
      //   metadata: this.selectedPayment.metadata,
      //   PaymentProcessorId: this.settings.PaymentProcessorId,
      // });
      this.resetDialog();
    },
    cancel() {
      this.keypad.value = 0;
      this.keypad.quantity = 1;
      false, this.$emit("cancel");
      this.dialog = false
    },
    resetDialog() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>

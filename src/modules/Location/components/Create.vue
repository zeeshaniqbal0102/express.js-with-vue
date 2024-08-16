<template>
  <v-container grid-list-lg>
    <v-card v-if="savedLocation">
      <v-card-text>
        <h2>Location Created</h2>
        <p>Employee with your name is automatically created for this store. Login to the store to continue the setup.</p>
      </v-card-text>
      <v-layout justify-end row class="mt-3">
        <v-btn color="primary" flat to="/location">{{ $t('buttons.back') }}</v-btn>
        <v-btn
          color="primary"
          target="_blank"
          :href="`${terminalURL}/login/location?code=${savedLocation.code}`"
        >{{ $t('buttons.openNewLocation') }}</v-btn>
      </v-layout>
    </v-card>

    <v-card class="mt-3" v-else>
      <v-toolbar class="elevation-0" color="gray">
        <v-toolbar-title>
          <h1 class="subheading font-weight-regular">Business Information</h1>
          <h1 class="caption font-weight-regular">
            Enter the business information for the location you would like to add.
            <strong>This information will be printed on the business invoice receipts.</strong>
          </h1>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-text-field
            v-model="Location.name"
            label="Business Name"
            :error-messages="locationNameErrors"
            hint="ie. CellSmart Wireless LLC, El Primo Repairs, Great Deli #4"
          ></v-text-field>

          <v-text-field v-model="Location.website" label="Website"></v-text-field>

          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field v-model="Location.DCALicense" label="DCA License"></v-text-field>
            </v-flex>

            <v-flex xs6>
              <v-text-field
                v-model="Location.email"
                :error-messages="locationEmailErrors"
                label="Email"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field v-model="Location.type" label="Type"></v-text-field>
            </v-flex>

            <v-flex xs6>
              <v-autocomplete
                :items="timeZones"
                label="Time Zone"
                item-text="label"
                item-value="tzCode"
                v-model="Location.timeZone"
              ></v-autocomplete>
            </v-flex>
          </v-layout>

          <h4 class="title font-weight-regular mt-3">{{ $t('labels.address') }}</h4>

          <v-layout row wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="Location.Address.type"
                @focus="$event.target.select()"
                :label="$t('labels.type')"
                hint="ie. Home, Office, Business"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="Location.Address.phoneNumber"
                @focus="$event.target.select()"
                :label="$t('labels.phoneNumber')"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="Location.Address.addressLine1"
                :error-messages="addressLine1Errors"
                :label="$t('labels.address')"
                @focus="$event.target.select()"
                @input="$v.Location.Address.addressLine1.$touch()"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="Location.Address.addressLine2"
                @focus="$event.target.select()"
                :label="$t('labels.addressLine2')"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="Location.Address.city"
                :error-messages="cityErrors"
                :label="$t('labels.city')"
                @focus="$event.target.select()"
                @input="$v.Location.Address.city.$touch()"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-autocomplete
                :items="states"
                :label="$t('labels.state')"
                :error-messages="stateIdErrors"
                item-text="name"
                item-value="id"
                v-model="Location.Address.StateId"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                :error-messages="postalCodeErros"
                v-model="Location.Address.postalCode"
                :label="$t('labels.zipCode')"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-autocomplete
                :items="countries"
                :error-messages="countryCodeErrors"
                :label="$t('labels.country')"
                item-text="name"
                item-value="code"
                v-model="Location.Address.CountryCode"
              ></v-autocomplete>
            </v-flex>

            <v-flex xs12>
              <v-textarea
                name="input-7-1"
                :label="$t('labels.description')"
                auto-grow
                v-model="Location.Address.description"
                hint="Any notes you would like to save about this location."
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-layout justify-end row class="mt-3">
            <v-btn color="pink" flat to="/location">{{ $t('buttons.cancel') }}</v-btn>
            <v-btn
              color="info"
              @click="submit"
              :loading="isLoading"
            >{{ $t('buttons.createLocation') }}</v-btn>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import timezones from 'compact-timezone-list';
import locationService from '../service.js';

const { validationMixin } = require('vuelidate');
const {
  required,
  minLength,
  email,
  requiredIf,
} = require('vuelidate/lib/validators');

export default {
  name: 'location-create',
  data() {
    return {
      terminalURL: process.env.VUE_APP_TERMINALURL,
      isLoading: false,
      savedLocation: null,
      timeZones: timezones,
      Location: {
        name: null,
        type: null,
        website: null,
        DCALicense: null,
        timeZone: this.$moment.tz.guess(),
        email: null,
        Address: {
          name: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          city: null,
          StateId: null,
          CountryCode: null,
          phoneNumber: null,
        },
      },
    };
  },
  computed: {
    ...mapGetters('global', ['states', 'countries', 'defaultCountryCode']),
    locationNameErrors() {
      const errors = [];
      if (!this.$v.Location.name.$dirty) return errors;
      if (!this.$v.Location.name.required) errors.push(this.$t('validations.fieldIsRequired'));
      if (!this.$v.Location.name.minLength) errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'));
      return errors;
    },
    locationEmailErrors() {
      const errors = [];
      if (!this.$v.Location.email.$dirty) return errors;
      if (!this.$v.Location.email.email) errors.push(this.$t('validations.emailIsNotValid'));
      return errors;
    },
    addressLine1Errors() {
      const errors = [];
      if (!this.$v.Location.Address.addressLine1.$dirty) return errors;
      if (!this.$v.Location.Address.addressLine1.minLength) errors.push(this.$t('validations.addressMustHaveAtleast2Characters'));
      if (!this.$v.Location.Address.addressLine1.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.Location.Address.city.$dirty) return errors;
      if (!this.$v.Location.Address.city.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    postalCodeErros() {
      const errors = [];
      if (!this.$v.Location.Address.postalCode.$dirty) return errors;
      if (!this.$v.Location.Address.postalCode.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    stateIdErrors() {
      const errors = [];
      if (!this.$v.Location.Address.StateId.$dirty) return errors;
      if (!this.$v.Location.Address.StateId.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    countryCodeErrors() {
      const errors = [];
      if (!this.$v.Location.Address.CountryCode.$dirty) return errors;
      if (!this.$v.Location.Address.CountryCode.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$swal
          .mixin({
            toast: true,
            position: 'top-end',
            timer: 3000,
          })
          .fire({
            type: 'error',
            title: this.$t('toastMessage.text.invalidFields'),
          });
      } else {
        this.isLoading = true;
        locationService
          .create(this.Location)
          .then((response) => {
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'success',
                title: 'Location was created',
              });
            this.savedLocation = response.data;
            this.isLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'error',
                title: 'Location was not created',
              });
            this.isLoading = false;
          });
      }
    },
  },
  mixins: [validationMixin],
  validations: {
    Location: {
      name: {
        required,
        minLength: minLength(4),
      },
      email: {
        email,
      },
      Address: {
        addressLine1: {
          required,
          minLength: minLength(2),
        },
        city: {
          required,
        },
        postalCode: {
          required,
        },
        StateId: {
          required,
        },
        CountryCode: {
          required,
        },
      },
    },
  },
};
</script>

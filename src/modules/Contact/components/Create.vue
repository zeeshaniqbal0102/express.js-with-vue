<template>
  <div>
    <v-container class="mw-1000">
      <v-card class="mb-5">
        <v-toolbar class="elevation-0" height="45" color="gray">
          <v-toolbar-title>
            <h1 class="title font-weight-regular">{{ $t('pageHeader.newContact') }}</h1>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-lg>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-text-field
                  xs-6
                  v-model="contact.firstName"
                  :error-messages="firstNameErrors"
                  :label="$t('labels.firstName')"
                  @input="$v.contact.firstName.$touch()"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  xs-6
                  v-model="contact.lastName"
                  :error-messages="lastNameErrors"
                  :label="$t('labels.lastName')"
                  @input="$v.contact.lastName.$touch()"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model.trim="contact.phoneNumber"
                  :error-messages="phoneNumberErrors"
                  :label="$t('labels.phoneNumber')"
                  @input="$v.contact.phoneNumber.$touch()"
                  mask="phone"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  v-model.trim="contact.email"
                  :error-messages="emailErrors"
                  :label="$t('labels.email')"
                  @input="$v.contact.email.$touch()"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field
                  xs-6
                  v-model="contact.language"
                  :label="$t('labels.language')"
                  hint="ie. Spanish, French"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6>
                <v-text-field xs-6 v-model="contact.keytag" :label="$t('labels.keytag')"></v-text-field>
              </v-flex>
            </v-layout>

            <v-flex xs12>
              <v-textarea
                name="input-7-1"
                :label="$t('labels.note')"
                auto-grow
                v-model="contact.note"
              ></v-textarea>
            </v-flex>
          </v-container>
          <v-expansion-panel class="elevation-0">
            <v-expansion-panel-content>
              <template v-slot:header>
                <div class="title font-weight-regular">{{ $t('pageHeader.address') }}</div>
              </template>
              <v-container grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.type"
                    @focus="$event.target.select()"
                    :label="$t('labels.type')"
                    hint="ie. Home, Office, Business"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.phoneNumber"
                    @focus="$event.target.select()"
                    :label="$t('labels.phoneNumber')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.addressLine1"
                    :error-messages="addressLine1Errors"
                    :label="$t('labels.address')"
                    @focus="$event.target.select()"
                    @input="$v.contact.Address.addressLine1.$touch()"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.addressLine2"
                    @focus="$event.target.select()"
                    :label="$t('labels.addressLine2')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.city"
                    :error-messages="cityErrors"
                    :label="$t('labels.city')"
                    @focus="$event.target.select()"
                    @input="$v.contact.Address.city.$touch()"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="states"
                    :label="$t('labels.state')"
                    item-text="name"
                    item-value="id"
                    v-model="contact.Address.StateId"
                  ></v-select>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    v-model="contact.Address.postalCode"
                    :label="$t('labels.zipCode')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="countries"
                    :label="$t('labels.country')"
                    item-text="name"
                    item-value="code"
                    v-model="contact.Address.CountryCode"
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-textarea
                    name="input-7-1"
                    :label="$t('labels.description')"
                    auto-grow
                    v-model="contact.Address.description"
                  ></v-textarea>
                </v-flex>
              </v-layout>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-card-text>
        <v-card-actions v-if="isModal">
          <v-layout justify-end row>
            <v-btn color="pink" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
            <v-btn color="info" @click="submit">{{ $t('buttons.save') }}</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-footer color="white" height="60" clipped-right fixed bottom v-if="!isModal">
      <v-layout justify-end row>
        <v-btn color="pink" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="info" @click="submit">{{ $t('buttons.save') }}</v-btn>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import customnerService from '../service';

const { validationMixin } = require('vuelidate');
const {
  required,
  minLength,
  email,
  requiredIf,
} = require('vuelidate/lib/validators');

export default {
  name: 'contact-create',
  props: ['isModal', 'searchText'],
  data() {
    return {
      savedcontact: null,
      contact: {
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        note: null,
        language: null,
        keytag: null,
        Address: {},
      },
    };
  },
  computed: {
    ...mapGetters('global', [
      'states',
      'countries',
      'defaultCountryCode',
      'location',
    ]),
    Address() {
      return this.contact.Address;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.contact.firstName.$dirty) return errors;
      if (!this.$v.contact.firstName.required) errors.push(this.$t('validations.fieldIsRequired'));
      if (!this.$v.contact.firstName.minLength) errors.push(this.$t('validations.addressMustHaveAtleast2Characters'));
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.contact.lastName.$dirty) return errors;
      if (!this.$v.contact.lastName.minLength) errors.push(this.$t('validations.addressMustHaveAtleast2Characters'));
      return errors;
    },
    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.contact.phoneNumber.$dirty) return errors;
      if (
        !this.$v.contact.phoneNumber.dirty
        && !(this.contact.phoneNumber || this.contact.email || this.contact.keytag)
      ) errors.push(this.$t('validations.phoneEmailOrKeytagRequired'));
      if (!this.$v.contact.phoneNumber.minLength) errors.push(this.$t('validations.validLetters10'));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.contact.email.$dirty) return errors;
      if (!this.$v.contact.email.email) errors.push(this.$t('validations.emailIsNotValid'));
      return errors;
    },
    addressLine1Errors() {
      const errors = [];
      if (!this.$v.contact.Address.addressLine1.$dirty) return errors;
      if (!this.$v.contact.Address.addressLine1.minLength) errors.push(this.$t('validations.addressMustHaveAtleast2Characters'));
      if (!this.$v.contact.Address.addressLine1.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    cityErrors() {
      const errors = [];
      if (!this.$v.contact.Address.city.$dirty) return errors;
      if (!this.$v.contact.Address.city.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
  },
  watch: {
    Address() {
      if (Object.keys(this.contact.Address).length > 0) {
        if (!this.contact.Address.city) this.contact.Address.city = this.location.Address.city;
        if (!this.contact.Address.StateId) this.contact.Address.StateId = this.location.Address.StateId;
        if (!this.contact.Address.CountryCode) this.contact.Address.CountryCode = this.location.Address.CountryCode;
      }
    },
    searchText(val) {
      if (!isNaN(parseFloat(val))) {
        this.contact.phoneNumber = val;
        return true;
      }
      if (val) this.contact.firstName = val;
    },
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        });
      } else {
        this.$Progress.start();
        customnerService
          .create(this.contact)
          .then((response) => {
            this.$toasted.success(
              this.$t('toastMessage.text.contactWasCreated'),
              {
                position: 'top-right',
                showHideTransition: 'slide',
                icon: 'check',
                duration: 3500,
              },
            );
            this.savedcontact = response.data;
            this.$Progress.finish();
            this.close();
          })
          .catch((error) => {
            this.$Progress.fail();
            console.log('error', error);
            switch (error.status) {
              case 409:
                this.$toasted.error(
                  this.$t('toastMessage.text.contactAlreadyExist'),
                  {
                    position: 'top-right',
                    showHideTransition: 'slide',
                    icon: 'error',
                    duration: 3500,
                  },
                );
                break;
              default:
                this.$toasted.error(
                  this.$t('toastMessage.text.errorCreatingcontact'),
                  {
                    position: 'top-right',
                    showHideTransition: 'slide',
                    icon: 'error',
                    duration: 3500,
                  },
                );
            }
          });
      }
    },
    cancel() {
      this.close();
    },
    close() {
      console.log(this.isModal);
      if (!this.isModal) {
        this.$router.push('/contact');
      } else {
        this.$emit('close', this.savedcontact);
      }
    },
  },
  mixins: [validationMixin],
  validations: {
    contact: {
      firstName: {
        required,
        minLength: minLength(2),
      },
      lastName: {
        minLength: minLength(1),
      },
      phoneNumber: {
        minLength: minLength(10),
      },
      email: {
        email,
      },
      Address: {
        addressLine1: {
          required: requiredIf(
            nestedModel => Object.keys(nestedModel).length > 0,
          ),
          minLength: minLength(2),
        },
        city: {
          required: requiredIf(
            nestedModel => Object.keys(nestedModel).length > 0,
          ),
        },
      },
    },
  },
};
</script>

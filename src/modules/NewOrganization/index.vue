<template>
  <v-container>
    <v-layout align-center fill-height column overflow-hidden>
      <v-layout row shrink class="ma-4">
        <h1 class="display-3 font-weight-black">Welcome</h1>
      </v-layout>

      <v-card class="mb-5" color="grey lighten-3" elevation="0">
        <v-container fluid grid-list-lg>
          <v-card v-if="stage === 1">
            <v-container>
              <h3>Organization</h3>
              <h4>
                Enter or your organization information. All your data will be saved under
                this organization whether you have one or more business locations.
              </h4>
              <v-text-field
                :background-color="`${Organization.name ? false : 'yellow'}`"
                data-cy="newOrganizationName"
                label="Organization Name"
                v-model="Organization.name"
                :error-messages="organizationNameErrors"
                hint="ie. Unlimited Repair Stores, 99 Cent Franchise, One Team Stores, Verizon Prepaid Stores"
              ></v-text-field>
              <v-text-field
                :background-color="`${Organization.phoneNumber ? false : 'yellow'}`"
                data-cy="newOrganizationPhoneNumber"
                v-model="Organization.phoneNumber"
                label="Phone number"
                :error-messages="organizationPhoneNumberErrors"
                hint="ie. Headquater Office Number, Owners phone number, etc"
                mask="phone"
              >
              </v-text-field>

              <v-text-field
                :background-color="`${Organization.email ? false : 'yellow'}`"
                v-model="Organization.email"
                data-cy="newOrganizationEmail"
                label="Email"
                :error-messages="organizationEmailErrors"
                hint="This email will receive information about all business under this Organization."
              >
              </v-text-field>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn
                  data-cy="newOrganizationContinueBtn"
                  large
                  class="white-btn v-btn-with-radius"
                  :disabled="$v.Organization.$invalid"
                  @click="nextStage"
                  >continue</v-btn
                >
              </v-layout>
            </v-container>
          </v-card>

          <v-card class="mt-3" v-if="stage === 2">
            <v-container>
              <h3>Your first location</h3>
              <p>
                Enter the business information for the first location/store front you
                would like to start with. If you're signing up more than one location,
                enter the location you consider as your main business and enter the rest
                after your organization set up is complete.
                <b>This information will be printed on the business invoice receipts.</b>
              </p>

              <v-text-field
                :background-color="`${Location.name ? false : 'yellow'}`"
                v-model="Location.name"
                data-cy="newOrganizationLocationName"
                label="Business Name"
                :error-messages="locationNameErrors"
                hint="ie. CellSmart Wireless LLC, El Primo Repairs, Great Deli #4"
              >
              </v-text-field>

              <v-text-field
                data-cy="newOrganizationLocationWebsite"
                v-model="Location.website"
                label="Website"
              >
              </v-text-field>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="Location.DCALicense"
                    data-cy="newOrganizationLocationDCALicense"
                    label="DCA License"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-text-field
                    v-model="Location.email"
                    :error-messages="locationEmailErrors"
                    data-cy="newOrganizationLocationEmail"
                    label="Email"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field
                    v-model="Location.type"
                    data-cy="newOrganizationLocationType"
                    label="Type"
                    hint="ie. Repairshop, Cellphone Store"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-autocomplete
                    :items="timeZones"
                    data-cy="newOrganizationLocationTimeZone"
                    label="Time Zone"
                    item-text="label"
                    item-value="tzCode"
                    v-model="Location.timeZone"
                  >
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <h4>Address</h4>

              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    data-cy="newOrganizationLocationAddressType"
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
                    data-cy="newOrganizationLocationAddressPhoneNumber"
                    :label="$t('labels.phoneNumber')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    type="text"
                    :background-color="
                      `${Location.Address.addressLine1 ? false : 'yellow'}`
                    "
                    v-model="Location.Address.addressLine1"
                    :error-messages="addressLine1Errors"
                    data-cy="newOrganizationLocationAddressLine1"
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
                    data-cy="newOrganizationLocationAddressLine2"
                    :label="$t('labels.addressLine2')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    :background-color="`${Location.Address.city ? false : 'yellow'}`"
                    type="text"
                    v-model="Location.Address.city"
                    :error-messages="cityErrors"
                    data-cy="newOrganizationLocationAddressCity"
                    :label="$t('labels.city')"
                    @focus="$event.target.select()"
                    @input="$v.Location.Address.city.$touch()"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-autocomplete
                    :background-color="`${Location.Address.StateId ? false : 'yellow'}`"
                    :items="states"
                    data-cy="newOrganizationLocationAddressState"
                    :label="$t('labels.state')"
                    :error-messages="stateIdErrors"
                    item-text="name"
                    item-value="id"
                    v-model="Location.Address.StateId"
                  ></v-autocomplete>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-text-field
                    :background-color="
                      `${Location.Address.postalCode ? false : 'yellow'}`
                    "
                    type="text"
                    :error-messages="postalCodeErros"
                    v-model="Location.Address.postalCode"
                    data-cy="newOrganizationLocationAddressPostalCode"
                    :label="$t('labels.zipCode')"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12 sm6 md6>
                  <v-autocomplete
                    :background-color="
                      `${Location.Address.CountryCode ? false : 'yellow'}`
                    "
                    :items="countries"
                    :error-messages="countryCodeErrors"
                    data-cy="newOrganizationLocationAddressCountry"
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
                    data-cy="newOrganizationLocationAddressDescription"
                    v-model="Location.Address.description"
                    hint="Any notes you would like to save about this location."
                  ></v-textarea>
                </v-flex>

                <v-layout>
                  <v-btn
                    data-cy="newOrganizationBackBtn"
                    large
                    class="white-btn v-btn-with-radius"
                    @click="prevStage"
                    >back</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    data-cy="newOrganizationContinueStageTwoBtn"
                    large
                    class="white-btn v-btn-with-radius"
                    :disabled="$v.Location.$invalid"
                    @click="nextStage"
                    >continue</v-btn
                  >
                </v-layout>
              </v-layout>
            </v-container>
          </v-card>

          <v-card class="mt-3" v-if="stage === 3">
            <v-container>
              <div v-if="this.plans.length > 0">
                <h2>Select the plan for the your first business</h2>
                <ul>
                  <li>Customize by adding Extras anytime.</li>
                  <li>No hidden fees, cancel any time.</li>
                </ul>
                <h5>Plans</h5>

                <v-radio-group v-model="selectedPlan" :mandatory="false">
                  <v-radio
                    data-cy="newOrganizationPlans"
                    v-for="item in plans"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></v-radio>
                </v-radio-group>
                <v-layout
                  v-if="selectedPlan && selectedPlan.Integrations.length > 0"
                  column=""
                >
                  <h4>Included features</h4>
                  <v-expansion-panel>
                    <v-expansion-panel-content
                      v-for="integration in selectedPlan.Integrations"
                      :key="integration.id"
                    >
                      <template v-slot:header>
                        <div>{{ integration.name }}</div>
                      </template>
                      <v-card>
                        <div v-if="integration.html" v-html="integration.html"></div>
                        <div v-else class="ma-2">{{ integration.description }}</div>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-layout>

                <v-layout
                  column
                  align-center
                  justify-center
                  v-show="selectedPlan && parseFloat(selectedPlan.amount) > 0"
                >
                  <h4 class="my-2">Payment Method</h4>
                  <v-layout row justify-center>
                    <img class="my-2" src="../../assets/images/visa.svg" height="26px" />
                    <img
                      class="my-2"
                      src="../../assets/images/mastercard.svg"
                      height="26px"
                    />
                    <img
                      class="my-2"
                      src="../../assets/images/discovercard.svg"
                      height="26px"
                    />
                    <img
                      class="my-2"
                      src="../../assets/images/americanexpress.svg"
                      height="26px"
                    />
                  </v-layout>
                  <v-card max-width="500px" min-width="300px">
                    <v-card-title v-if="selectedPlan && selectedPlan.trialDays">
                      You will not be charged until
                      {{
                        selectedPlan.trialDays > 1
                          ? `${selectedPlan.trialDays} days`
                          : `${selectedPlan.trialDays} day`
                      }}
                      from today. <br />You may cancel at any time.
                    </v-card-title>
                    <v-card-text>
                      <card
                        class="stripe-card my-3"
                        :class="{ complete }"
                        :stripe="stripePublicKey"
                        @change="complete = $event.complete"
                      />
                      <img
                        class="my-2"
                        src="../../assets/images/powered_by_stripe.svg"
                        height="26px"
                      />
                    </v-card-text>
                  </v-card>
                </v-layout>
                <v-flex style="font-size: 12px" class="ma-3">
                  <p>
                    Your {{ clientName }} subscription will begin when you click Create
                    Organization. By clicking Create Organization below, you authorize us
                    to: (i) begin and continue your month-to-month subscription
                    automatically, and (ii) charge your subscription monthly to the
                    payment method provided, unless you cancel. Cancel by contacting us at
                    {{ clientEmail }}. Subscription fees are charged monthly in advance
                    and no credits or refunds will be issued for partial or prepaid months
                    after cancellation. All prices, fees, charges, services, programming,
                    features, functionality and offers subject to change without notice.
                  </p>
                  <p>
                    By clicking, “Create Organization”, I confirm that I am over 13 and
                    have read the
                    <a href="https://www.cellsmartpos.com/termsandcondition/"
                      >Terms of Use</a
                    >.
                  </p>
                </v-flex>
              </div>
              <div v-else>
                You're all set. Confirm the terms and condition to finalize your sign up.
              </div>
              <v-layout class="mt-3">
                <v-btn
                  data-cy="newOrganizationStageThreeBackBtn"
                  large
                  class="white-btn v-btn-with-radius"
                  @click="prevStage"
                  >back</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  data-cy="newOrganizationStageThreeCancelBtn"
                  color="primary"
                  flat
                  to="/login"
                  >{{ $t('buttons.cancel') }}</v-btn
                >
                <v-btn
                  data-cy="newOrganizationStageThreeCreateOrganization"
                  color="primary"
                  @click="submit"
                  :loading="isLoading"
                  >{{ $t('buttons.createOrganization') }}</v-btn
                >
              </v-layout>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mapGetters, mapActions } from 'vuex'
import timezones from 'compact-timezone-list'
import organizationService from '../Organization/service.js'
import publicService from '@/api/public'

const { validationMixin } = require('vuelidate')
const { required, minLength, email, requiredIf } = require('vuelidate/lib/validators')

export default {
  name: 'new-organization',
  components: {
    Card,
  },
  created() {
    publicService
      .GetPlans({ planId: this.$route.params.plan, includeIntegrations: true })
      .then(response => {
        this.plans = response.data
        if (this.$route.params.plan && response.data.length > 0) {
          this.Location.planId = this.$route.params.plan
          this.selectedPlan = response.data[0]
        }
      })
  },
  data() {
    return {
      stage: 1,
      clientEmail: process.env.VUE_APP_CLIENT_EMAIL,
      clientName: process.env.VUE_APP_CLIENT_NAME,
      complete: false,
      stripePublicKey: process.env.VUE_APP_STRIPE_PK,
      isLoading: false,
      ReferralCode: null,
      timeZones: timezones,
      Organization: {
        name: null,
        phoneNumber: null,
        email: null,
        cardToken: null,
      },
      plans: [],
      selectedPlan: null,
      Location: {
        name: null,
        type: null,
        website: null,
        DCALicense: null,
        timeZone: this.$moment.tz.guess() || 'America/New_York',
        email: null,
        Address: {
          name: null,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          city: null,
          StateId: null,
          CountryCode: 840,
          phoneNumber: null,
        },
      },
      taxTemplate: {
        name: null,
        autoApply: false,
        symbol: null,
        type: 'PERCENTAGE',
        percentage: null,
        amount: null,
      },
    }
  },
  methods: {
    ...mapActions('global', ['initOrganization']),
    prevStage() {
      this.stage--
    },
    nextStage() {
      this.stage++
    },
    async submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error('Invalid Input', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
      } else if (
        !this.complete &&
        this.selectedPlan &&
        parseFloat(this.selectedPlan.amount) > 0
      ) {
        this.$toasted.error('Card is required.', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
      } else {
        this.isLoading = true
        // If card was added then we need to create the token before creating the organization
        if (this.complete) {
          const data = await createToken()
          this.Organization.cardToken = data.token.id
        }

        // Check if plan was selected
        if (this.selectedPlan) {
          this.Location.planId = this.selectedPlan.planId
        }
        organizationService
          .create({
            ReferralCode: this.ReferralCode,
            Organization: this.Organization,
            Location: this.Location,
          })
          .then(response => {
            return this.initOrganization(response.data)
              .then(() => {
                this.$router.push({ path: '/' })
              })
              .catch(error => {
                console.log(error)
              })
            this.isLoading = false
          })
          .catch(error => {
            console.log(error)
            this.$toasted.error(error.data.message, {
              position: 'top-right',
              showHideTransition: 'slide',
              icon: 'error',
              duration: 4000,
            })
            this.isLoading = false
          })
      }
    },
  },
  computed: {
    ...mapGetters('global', ['states', 'countries', 'defaultCountryCode']),
    organizationNameErrors() {
      const errors = []
      if (!this.$v.Organization.name.$dirty) return errors
      if (!this.$v.Organization.name.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.Organization.name.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
    organizationPhoneNumberErrors() {
      const errors = []
      if (!this.$v.Organization.phoneNumber.$dirty) return errors
      if (!this.$v.Organization.phoneNumber.required)
        errors.push(this.$t('validations.phoneNumberIsRequired'))
      if (!this.$v.Organization.phoneNumber.minLength)
        errors.push(this.$t('validations.invalidPhoneNumber'))
      return errors
    },
    organizationEmailErrors() {
      const errors = []
      if (!this.$v.Organization.email.$dirty) return errors
      if (!this.$v.Organization.email.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.Organization.email.email)
        errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
    locationNameErrors() {
      const errors = []
      if (!this.$v.Location.name.$dirty) return errors
      if (!this.$v.Location.name.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.Location.name.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
    locationEmailErrors() {
      const errors = []
      if (!this.$v.Location.email.$dirty) return errors
      if (!this.$v.Location.email.email)
        errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
    addressLine1Errors() {
      const errors = []
      if (!this.$v.Location.Address.addressLine1.$dirty) return errors
      if (!this.$v.Location.Address.addressLine1.minLength)
        errors.push(this.$t('validations.addressMustHaveAtleast2Characters'))
      if (!this.$v.Location.Address.addressLine1.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    cityErrors() {
      const errors = []
      if (!this.$v.Location.Address.city.$dirty) return errors
      if (!this.$v.Location.Address.city.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    postalCodeErros() {
      const errors = []
      if (!this.$v.Location.Address.postalCode.$dirty) return errors
      if (!this.$v.Location.Address.postalCode.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    stateIdErrors() {
      const errors = []
      if (!this.$v.Location.Address.StateId.$dirty) return errors
      if (!this.$v.Location.Address.StateId.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    countryCodeErrors() {
      const errors = []
      if (!this.$v.Location.Address.CountryCode.$dirty) return errors
      if (!this.$v.Location.Address.CountryCode.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
  },
  mixins: [validationMixin],
  validations: {
    Organization: {
      name: {
        required,
        minLength: minLength(4),
      },
      phoneNumber: {
        required,
        minLength: minLength(10),
      },
      email: {
        required,
        email,
      },
    },
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
}
</script>

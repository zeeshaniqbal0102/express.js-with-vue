<template>
  <v-container grid-list-lg fluid>
    <TitleBar :title="$t('pageHeader.updateEmployee')" />
    <v-card flat class="outlined" :color="$style.card.background">
      <CardToolbar :title="$t('labels.employee')" :isModal="false" />
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.firstName') }}</span>
            <v-text-field
              type="text"
              solo
              v-model="employee.firstName"
              @focus="$event.target.select()"
              :error-messages="firstNameErrors"
              :label="$t('labels.firstName')"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.lastName') }}</span>
            <v-text-field
              type="text"
              solo
              v-model="employee.lastName"
              @focus="$event.target.select()"
              :label="$t('labels.lastName')"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.pinNumber') }}</span>
            <v-text-field
              v-model="employee.pin"
              solo
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('labels.pin')"
              @focus="$event.target.select()"
              v-on:keyup.enter="submit"
              :error-messages="pinErrors"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.phoneNumber') }}</span>
            <v-text-field
              type="tel"
              solo
              v-model="employee.phoneNumber"
              :error-messages="phoneNumberErrors"
              :label="$t('labels.phoneNumber')"
              @focus="$event.target.select()"
              mask="phone"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.emailAddress') }}</span>
            <v-text-field
              type="email"
              solo
              v-model="employee.email"
              :error-messages="emailErrors"
              :label="$t('labels.emailAddress')"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 sm6>
            <span class="mb-1 font-weight-regular">{{ $t('labels.hourlyRate') }}</span>
            <v-text-field
              type="number"
              solo
              v-model="employee.hourlyRate"
              :label="$t('labels.hourlyRate')"
            ></v-text-field>
          </v-flex>
					
          <v-flex xs12>
            <v-textarea
              name="input-7-1"
              :label="$t('labels.note')"
              auto-grow
              solo
              v-model="employee.note"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text>
        <v-expansion-panel class="elevation-0">
          <v-expansion-panel-content>
            <div slot="header">
              <span class="headline">{{ $t('pageHeader.address') }}</span>
            </div>
            <v-card flat class="outlined" :color="$style.card.background">
              <v-container grid-list-lg>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.type"
                      @focus="$event.target.select()"
                      :label="$t('labels.type')"
                      hint="ie. Home, Office, Business"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.phoneNumber"
                      @focus="$event.target.select()"
                      :label="$t('labels.phoneNumber')"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.addressLine1"
                      :error-messages="addressLine1Errors"
                      :label="$t('labels.address')"
                      @focus="$event.target.select()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.addressLine2"
                      @focus="$event.target.select()"
                      :label="$t('labels.addressLine2')"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.city"
                      :error-messages="cityErrors"
                      :label="$t('labels.city')"
                      @focus="$event.target.select()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-autocomplete
                      :items="states"
                      solo
                      :label="$t('labels.state')"
                      item-text="name"
                      item-value="id"
                      v-model="employee.Address.StateId"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      solo
                      v-model="employee.Address.postalCode"
                      :label="$t('labels.zipCode')"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-autocomplete
                      :items="countries"
                      solo
                      :label="$t('labels.country')"
                      item-text="name"
                      item-value="code"
                      v-model="employee.Address.CountryCode"
                    ></v-autocomplete>
                  </v-flex>

                  <v-flex xs12>
                    <v-textarea
                      name="input-7-1"
                      solo
                      :label="$t('labels.description')"
                      auto-grow
                      v-model="employee.Address.description"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <div slot="header">
              <span class="headline">{{ $t('labels.locations') }}</span>
            </div>
            <v-card flat class="outlined" :color="$style.card.background">
              <v-card-text>
                <v-layout row wrap>
                  <v-flex>
                    <v-autocomplete
                      solo
                      :label="$t('labels.selectLocation')"
                      :items="locations"
                      item-text="name"
                      v-model="selectedLocation"
                      return-object
                    >
                      <template slot="item" slot-scope="{ item }">
                        <span>{{ item.name }}</span>
                        <v-spacer />
                        <span v-if="item.Address">{{ item.Address.addressLine1 }}</span>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex>
                    <v-autocomplete
                      :label="$t('labels.selectRole')"
                      :items="roles"
                      solo
                      item-text="name"
                      v-model="selectedRole"
                      return-object
                    >
                      <template slot="item" slot-scope="{ item }">
                        <span>{{ item.name }}</span>
                      </template>
                    </v-autocomplete>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn
                      class="mt-0"
                      color="teal"
                      round
                      :disabled="!selectedLocation || !selectedRole"
                      @click="addLocation"
                      >Add Location</v-btn
                    >
                  </v-flex>
                </v-layout>
                <v-data-table
                  :headers="locationTable.headers"
                  :items="employee.Locations"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">
                      {{ props.item.name }}
                    </td>
                    <td class="text-xs-left">
                      {{
                        props.item.EmployeeRole ? props.item.EmployeeRole.name : 'No Role'
                      }}
                    </td>
                    <td class="justify-center layout px-0">
                      <v-icon @click="deleteLocation(props.index)">
                        delete
                      </v-icon>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card-text>
      <v-card-actions :style="{ 'background-color': $style.card.action }">
        <v-spacer></v-spacer>
        <v-btn color="info" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="purple" dark @click="submit">{{ $t('buttons.update') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import employeeService from '../service'
import locationService from '../../Location/service.js'
import rolesService from '../modules/Roles/service.js'

const { validationMixin } = require('vuelidate')
const {
  required,
  minLength,
  email,
  sameAs,
  requiredIf,
} = require('vuelidate/lib/validators')

export default {
  name: 'employee-edit',
  props: {
    isModal: Boolean,
  },
  data() {
    return {
      showPassword: false,
      locations: [],
      roles: [],
      selectedLocation: null,
      selectedRole: null,
      locationTable: {
        headers: [
          {
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Role',
            value: 'EmployeeRole',
            sortable: false,
          },
          {
            text: 'Action',
            value: 'action',
            sortable: false,
            align: 'center',
          },
        ],
      },
      employee: {
        firstName: null,
        lastName: null,
        phoneNumber: null,
        accountNumber: null,
        pinCode: null,
				confirmPin: null,
				hourlyRate: null,
        email: null,
        website: null,
        note: null,
        Address: {},
        ActiveLocations: [],
      },
    }
  },
  computed: {
    ...mapGetters('global', ['states', 'countries', 'defaultCountryCode', 'location']),
    Address() {
      return this.employee.Address || {}
    },
    firstNameErrors() {
      const errors = []
      if (!this.$v.employee.firstName.$dirty) return errors
      if (!this.$v.employee.firstName.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.employee.firstName.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast2ChrLong'))
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.employee.lastName.$dirty) return errors
      if (!this.$v.employee.lastName.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast2ChrLong'))
      return errors
    },
    phoneNumberErrors() {
      const errors = []
      if (!this.$v.employee.phoneNumber.$dirty) return errors
      if (!this.$v.employee.phoneNumber.minLength)
        errors.push(this.$t('validations.validLetters10'))
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.employee.email.$dirty) return errors
      if (!this.$v.employee.email.email)
        errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
    addressLine1Errors() {
      const errors = []
      if (!this.$v.employee.Address.addressLine1.$dirty) return errors
      if (!this.$v.employee.Address.addressLine1.minLength)
        errors.push(this.$t('validations.addressMustHaveAtleast2Characters'))
      if (!this.$v.employee.Address.addressLine1.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      return errors
    },
    cityErrors() {
      const errors = []
      if (!this.$v.employee.Address.city.$dirty) return errors
      if (!this.$v.employee.Address.city.required)
        errors.push(this.$t('validations.cityIsRequired'))
      return errors
    },
    pinErrors() {
      const errors = []
      if (!this.$v.employee.pinCode.$dirty) return errors
      if (!this.$v.employee.pinCode.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
    confirmPinErrors() {
      const errors = []
      if (!this.$v.employee.confirmPin.$dirty) return errors
      if (!this.$v.employee.confirmPin.sameAsPin)
        errors.push(this.$t('validations.pinDoesNotMatch'))
      return errors
    },
  },
  watch: {
    Address() {
      if (Object.keys(this.employee.Address).length > 0) {
        if (!this.employee.Address.city)
          this.employee.Address.city = this.location.Address.city
        if (!this.employee.Address.StateId)
          this.employee.Address.StateId = this.location.Address.StateId
        if (!this.employee.Address.CountryCode)
          this.employee.Address.CountryCode = this.location.Address.CountryCode
      }
    },
  },
  async created() {
    try {
      this.roles = (await rolesService.getAll()).data
      this.locations = (await locationService.getAll({ limit: 40 })).data
      await this.loademployee()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    loademployee() {
      if (!this.$route.params || !this.$route.params.id) return this.$router.go(-1)
      const { id } = this.$route.params
      this.$Progress.start()
      employeeService.getById(id, { includeLocations: true }).then(response => {
        this.$Progress.finish()
        this.employee.id = response.data.id
        this.employee.firstName = response.data.firstName
        this.employee.lastName = response.data.lastName
        this.employee.phoneNumber = response.data.phoneNumber
        this.employee.accountNumber = response.data.accountNumber
        this.employee.email = response.data.email
        this.employee.website = response.data.website
				this.employee.note = response.data.note
				this.employee.hourlyRate = response.data.hourlyRate
        Promise.all(
          response.data.ActiveLocations.map(async location => {
            this.selectedLocation = location
            await this.addLocation()
            return true
          }),
        )
        // todo: support more than one address
        this.employee.Address = response.data.Address || {}
      })
    },
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          icon: 'error',
          duration: 4000,
        })
      } else {
        this.$Progress.start()
        console.log('sending employee', this.employee)
        employeeService
          .update(this.employee.id, this.employee)
          .then(() => {
            this.$toasted.success(this.$t('toastMessage.text.employeeUpdate'), {
              position: 'top-right',
              showHideTransition: 'slide',
              icon: 'check',
              duration: 4000,
            })
            this.$Progress.finish()
            this.close()
          })
          .catch(err => {
            console.log(err)
            this.$swal
              .mixin({
                toast: true,
                showConfirmButton: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'error',
                title: err.data.message,
              })
            this.$Progress.fail()
          })
      }
    },
    addLocation() {
      if (!this.selectedLocation.Location) {
        this.selectedLocation = {
          Location: this.selectedLocation,
          EmployeeRole: this.selectedRole,
        }
      }

      if (this.selectedLocation.delete) {
        this.selectedLocation.delete = false
      } else {
        this.employee.ActiveLocations = this.employee.ActiveLocations.concat(
          this.selectedLocation,
        )
      }
      // find the select location and remove it from the list
      const foundIndex = this.locations.findIndex(element =>
        !this.selectedLocation.Location
          ? this.selectedLocation.id === element.id
          : this.selectedLocation.Location.id === element.id,
      )
      if (foundIndex > -1) {
        this.locations.splice(foundIndex, 1)
        this.locations = [...this.locations]
      }

      this.selectedLocation = 0
      this.selectedRole = 0
    },
    deleteLocation(index) {
      console.log(index)
      this.locations = [this.employee.ActiveLocations[index].Location, ...this.locations]
      this.employee.ActiveLocations[index].delete = true
      // Need to refresh the list
      this.employee.ActiveLocations = [...this.employee.ActiveLocations]
    },
    cancel() {
      this.close()
    },
    close() {
      if (!this.isModal) {
        this.$router.go(-1)
      } else {
        this.$emit('close')
      }
    },
  },
  mixins: [validationMixin],
  validations: {
    employee: {
      pinCode: {
        minLength: minLength(4),
      },
      confirmPin: {
        sameAsPin: sameAs('pinCode'),
      },
      firstName: {
        required,
        minLength: minLength(4),
      },
      phoneNumber: {
        minLength: minLength(10),
      },
      email: {
        email,
      },
      Address: {
        addressLine1: {
          required: requiredIf(nestedModel => Object.keys(nestedModel).length > 0),
          minLength: minLength(2),
        },
        city: {
          required: requiredIf(nestedModel => Object.keys(nestedModel).length > 0),
        },
      },
    },
  },
}
</script>

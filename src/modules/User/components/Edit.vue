<template>
  <div>
    <!-- Main Section -->

    <v-container class="mw-1000">
      <v-card class="pb-2 mb-3 elevation-0">
        <v-card-title>
          <span class="headline">{{ $t('pageHeader.updateUser') }}</span>
        </v-card-title>
        <v-container grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="user.firstName"
                @focus="$event.target.select()"
                :error-messages="nameErrors"
                :label="$t('labels.firstName')"
                @input="$v.user.firstName.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6>
              <v-text-field
                type="text"
                v-model="user.lastName"
                @focus="$event.target.select()"
                :label="$t('labels.lastName')"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                v-model.trim="user.phoneNumber"
                :error-messages="phoneNumberErrors"
                :label="$t('labels.phoneNumber')"
                @input="$v.user.phoneNumber.$touch()"
                mask="phone"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-text-field
                type="email"
                v-model="user.email"
                :error-messages="emailErrors"
                :label="$t('labels.emailAddress')"
                @input="$v.user.email.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-container>
    <!-- Additional Info -->

    <v-footer color="white" height="60" clipped-right fixed bottom>
      <v-layout justify-end row v-if="!isModal">
        <v-btn color="info" flat @click="cancel">{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="info" @click="submit">{{ $t('buttons.update') }}</v-btn>
      </v-layout>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import userService from '../service'

const { validationMixin } = require('vuelidate')
const { required, minLength, email, requiredIf } = require('vuelidate/lib/validators')

export default {
  name: 'user-edit',
  props: {
    isModal: Boolean,
  },
  data() {
    return {
      showPassword: false,
      user: {
        firstName: null,
        lastName: null,
        email: null,
        phoneNumber: null,
      },
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.user.firstName.$dirty) return errors
      if (!this.$v.user.firstName.required)
        errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.firstName.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.user.email.$dirty) return errors
      if (!this.$v.user.email.email) errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
    phoneNumberErrors() {
      const errors = []
      if (!this.$v.user.phoneNumber.$dirty) return errors
      // if (!this.$v.user.phoneNumber.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.phoneNumber.minLength)
        errors.push(this.$t('validations.validLetters10'))
      return errors
    },
  },
  created() {
    this.loaduser()
  },
  methods: {
    loaduser() {
      if (!this.$route.params || !this.$route.params.id) return this.$router.go(-1)
      const { id } = this.$route.params
      this.$Progress.start()
      userService.getById(id).then(response => {
        this.$Progress.finish()
        this.user.id = response.data.id
        this.user.firstName = response.data.firstName
        this.user.lastName = response.data.lastName
        this.user.email = response.data.email
        this.user.phoneNumber = response.data.phoneNumber
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
        console.log('sending user', this.user)
        userService
          .update(this.user.id, this.user)
          .then(() => {
            this.$toasted.success(this.$t('toastMessage.text.userUpdate'), {
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
    user: {
      firstName: {
        required,
        minLength: minLength(4),
      },
      email: {
        email,
      },
      phoneNumber: {
        minLength: minLength(10),
      },
    },
  },
}
</script>

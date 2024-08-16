<template>
  <v-container>

    <v-layout align-center justify-center row fill-height>

      <v-card width="800px" height="500px">
          <v-layout v-if="signUpSuccess" align-center fill-height>
            <v-layout align-center justify-center column fill-height>
              <v-icon color="green" large>mdi-email</v-icon>
              <h2 class=mb-2>{{ $t('pageHeader.verifyYourEmail') }}</h2>
              <p>{{ $t('subTitle.verifyMessage') }}</p>
              <v-btn data-cy="signUpResendEmail" large class="white-btn v-btn-with-radius" @click="resend">Resend Email</v-btn>
              <v-btn data-cy="signUpAlreadyVerified" large class="white-btn v-btn-with-radius" to="/login">{{ $t('buttons.alreadyVerified') }}</v-btn>
            </v-layout>
          </v-layout>
          <v-layout column fill-height class="pa-4" v-else>
            <v-layout row fill-height >
              <v-flex xs12 md6 fill-height>
                <v-layout column fill-height>
                  <!-- logo -->
                  <v-flex shrink>
                    <img height="35px" src="../../assets/logo.png" />
                  </v-flex>

                  <!-- header -->
                  <v-flex class="mt-2" shrink>
                    <h1>{{ $t('pageHeader.createYourAccount')}}</h1>
                  </v-flex>
                  <!-- user info -->
                  <v-layout wrap shrink>
                    <v-flex xs6 class="pa-1">
                      <v-text-field
                      :error-messages="firstNameErrors"
                      data-cy="signUpFirstName"
                      :label="$t('labels.firstName')"
                      v-model="user.firstName"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="pa-1">
                      <v-text-field
                      data-cy="signUpLastName"
                      :label="$t('labels.lastName')"
                      :error-messages="lastNameErrors"
                      v-model="user.lastName"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-flex shrink>
                    <v-text-field
                    data-cy="signUpEmail"
                    :label="$t('labels.email')"
                    :error-messages="emailErrors"
                    v-model="user.email"
                    class="pa-1"
                    ></v-text-field>
                  </v-flex>

                  <v-layout row shrink>
                    <v-flex xs6 class="pa-1">
                      <v-text-field
                      data-cy="signUpPassword"
                      :label="$t('labels.password')"
                      :error-messages="passwordErrors"
                      v-model="user.password"
                      type="password"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6 class="pa-1">
                      <v-text-field
                      data-cy="signUpConfirmPassword"
                      :label="$t('labels.confirmPassword')"
                      :error-messages="confirmPasswordErrors"
                      v-model="user.confirmPassword"
                      type="password"
                      v-on:keyup.enter="submit"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-spacer></v-spacer>
                  <!-- option to sign in and sign up -->
                  <!-- terms -->

                </v-layout>
              </v-flex>
              <v-layout hidden-sm-and-down md6 align-center>
                <img width="100%" src="../../assets/images/virtual-pos.png" />
              </v-layout>

            </v-layout>
            <v-layout row justify-space-between shrink>
              <v-btn data-cy="signUpSignInBtn" flat to="/login">{{ $t('buttons.signIn') }}</v-btn>
              <v-btn data-cy="signUpNextBtn" color="orange" dark @click="submit">{{ $t('buttons.next') }}</v-btn>
            </v-layout>
          </v-layout>
      </v-card>

    </v-layout>
  </v-container>
</template>
<script>
import signUpService from './service.js'

const { validationMixin } = require('vuelidate')
const {
  required,
  minLength,
  email,
  sameAs,
} = require('vuelidate/lib/validators')

export default {
  name: 'signUp',
  created() {
    if (this.$route.query) {
      this.user.ReferralCode = this.$route.query.referralCode
      this.user.email = this.$route.query.email
      this.user.plan = this.$route.query.plan
      this.user.source = this.$route.query.source
    }
    if (this.$route.params.email) {
      this.user.email = this.$route.params.email
      this.user.firstName = this.$route.params.firstName
      this.user.lastName = this.$route.params.lastName
      this.user.forceVerify = this.$route.params.verified
    }
  },
  data() {
    return {
      user: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        acceptedTerms: false,
        ReferralCode: null,
        confirmPassword: null,
        plan: null,
        forceVerify: false,
      },
      viewTerms: false,
      signUpSuccess: false,
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error(this.$t('toastMessage.text.invalidFields'), {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 3500,
        })
      } else {
        signUpService.submit(this.user)
          .then((response) => {
            console.log(response)
            if (this.$route.query.plan || this.user.forceVerify) {
              this.$toasted.success('User created.', {
                position: 'top-right',
                showHideTransition: 'slide',
                duration: 3500,
              })
              this.$router.push({ name: 'newOrganization', params: { plan: this.$route.query.plan } })
            } else {
              this.signUpSuccess = true
            }
          })
          .catch((error) => {
            console.log('test', error)
            this.$toasted.error(error.data.message, {
              position: 'top-right',
              showHideTransition: 'slide',
              duration: 3500,
            })
          })
      }
    },
    resend() {
      console.log(this.email)
      signUpService.resendVerifyEmail({ email: this.user.email })
        .then((response) => {
          console.log(response.data)
          this.$toasted.success(`Resent Email to ${this.user.email}`, {
            position: 'top-right',
            showHideTransition: 'slide',
            icon: 'check',
            duration: 2000,
          })
        })
        .catch((error) => {
          this.$Progress.finish()
          this.isLoading = false
          this.error = true
          this.errorMessage = error.data.message
        })
    },
  },
  computed: {
    firstNameErrors() {
      const errors = []
      if (!this.$v.user.firstName.$dirty) return errors
      if (!this.$v.user.firstName.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.firstName.minLength) errors.push(this.$t('validations.fieldMustbeatLeast2ChrLong'))
      return errors
    },
    lastNameErrors() {
      const errors = []
      if (!this.$v.user.lastName.$dirty) return errors
      if (!this.$v.user.lastName.minLength) errors.push(this.$t('validations.fieldMustbeatLeast2ChrLong'))
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.user.email.$dirty) return errors
      if (!this.$v.user.email.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.email.email) errors.push(this.$t('validations.emailIsNotValid'))
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.user.password.$dirty) return errors
      if (!this.$v.user.password.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.password.minLength) errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.user.confirmPassword.$dirty) return errors
      if (!this.$v.user.confirmPassword.sameAsPassword) errors.push(this.$t('validations.passwordDoesNotMatch'))
      return errors
    },
  },
  mixins: [validationMixin],
  validations: {
    user: {
      firstName: {
        required,
        minLength: minLength(2),
      },
      lastName: {
        minLength: minLength(1),
      },
      email: {
        email,
        required,
      },
      password: {
        required,
        minLength: minLength(4),
      },
      confirmPassword: {
        sameAsPassword: sameAs('password'),
      },
    },
  },
}
</script>
<style lang="scss" scoped>
h1 {
    font-size: 22px;
    font-weight: 400;
    line-height: 32px;
    margin: 0;
}
</style>

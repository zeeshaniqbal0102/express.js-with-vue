<template>
  <v-layout column>
    <h2>{{ $t('pageHeader.resetPassword') }}</h2>
    <v-layout row shrink>
      <v-flex xs6 class="pa-1">
        <v-text-field
        :label="$t('labels.password')"
        :error-messages="passwordErrors"
        v-model="user.newPassword"
        type="password"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 class="pa-1">
        <v-text-field
        :label="$t('labels.confirmPassword')"
        :error-messages="confirmPasswordErrors"
        v-model="user.confirmPassword"
        type="password"
        v-on:keyup.enter="submit"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <div>
      <v-btn to="/login">Cancel</v-btn>
      <v-btn @click="submit">Save</v-btn>
    </div>
  </v-layout>
</template>
<script>
import authService from '../service'

const { validationMixin } = require('vuelidate')
const {
  required,
  minLength,
  email,
  sameAs,
} = require('vuelidate/lib/validators')

export default {
  name: 'reset-password',
  created() {
    if (this.$route.query.token) {
      this.user.resetPasswordToken = this.$route.query.token
    } else {
      this.$router.push('/login')
    }
  },
  data() {
    return {
      user: {
        resetPasswordToken: null,
        newPassword: null,
        confirmPassword: null,
      },
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.$toasted.error('Invalid Input', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        })
      } else {
        this.$Progress.start()
        authService.resetPassword({
          newPassword: this.user.newPassword,
          resetPasswordToken: this.user.resetPasswordToken,
        }).then((response) => {
          this.$Progress.finish()
          this.$swal('Password Reset. Please Login.')
          this.$router.push('/login')
        })
          .catch((error) => {
            this.$Progress.fail()
            console.log(error)
            this.$toasted.error(error.data.message, {
              position: 'top-right',
              showHideTransition: 'slide',
              duration: 2000,
            })
          })
      }
    },
  },
  computed: {
    passwordErrors() {
      const errors = []
      if (!this.$v.user.newPassword.$dirty) return errors
      if (!this.$v.user.newPassword.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.user.newPassword.minLength) errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
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
      newPassword: {
        required,
        minLength: minLength(4),
      },
      confirmPassword: {
        sameAsPassword: sameAs('newPassword'),
      },
    },
  },
}
</script>

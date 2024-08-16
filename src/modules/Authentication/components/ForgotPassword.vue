<template>
  <v-layout column>
    <h2>{{ $t('pageHeader.forgotPassword') }}</h2>
    <div v-if="emailSent">
      <v-layout column>
        Email sent!
        <v-btn data-cy="forgotPasswordEmailSentBtn" to="/login">Login</v-btn>
      </v-layout>

    </div>
    <div v-else>
      Enter email to receive password reset link.
      <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      data-cy="forgotPasswordEmail"
      :label="$t('labels.email')"
      >
      </v-text-field>
      <v-btn data-cy="forgotPasswordCancelBtn" to="/login">Cancel</v-btn>
      <v-btn data-cy="forgotPasswordSendBtn" @click="submit">Send Email</v-btn>
    </div>
  </v-layout>
</template>
<script>
import authService from '../service'

const { validationMixin } = require('vuelidate')
const { required, email } = require('vuelidate/lib/validators')

export default {
  name: 'forget-password',
  data() {
    return {
      email: null,
      emailSent: false,
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
        authService.forgetPassword({
          email: this.email,
        }).then((response) => {
          this.$Progress.finish()
          this.emailSent = true
        })
          .catch((error) => {
            this.$Progress.fail()
            console.log(error)
          })
      }
    },
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      if (!this.$v.email.email) errors.push('Email is not valid')
      if (!this.$v.email.required) errors.push('Email is required.')
      return errors
    },
  },
  mixins: [validationMixin],
  validations: {
    email: {
      email,
      required,
    },
  },
}
</script>

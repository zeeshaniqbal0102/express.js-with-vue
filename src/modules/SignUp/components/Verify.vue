<template>
  <v-container>
    <v-layout align-center justify-center row fill-height>
      <v-card width="800px" height="500px">
          <v-layout align-center column="" fill-height>
            <v-layout align-center justify-center column fill-height v-if="isLoading">
               <v-flex shrink>
                <img height="35px" src="../../../assets/logo.png" />
              </v-flex>
              <h1>Verifying your email</h1>
              <v-progress-linear
                indeterminate
                color="blue"
                class="mb-0"
              ></v-progress-linear>
            </v-layout>
            <v-layout align-center justify-center column fill-height v-if="!isLoading && !error">
              <v-flex shrink>
                <img height="35px" src="../../../assets/logo.png" />
              </v-flex>
              <h2>Success</h2>
              <p>Your email has been verified!</p>
              <v-btn large class="white-btn v-btn-with-radius" to="/login">Login</v-btn>
            </v-layout>
            <v-layout align-center justify-center column fill-height v-if="error" class="pa-2">
              <v-flex shrink>
                <img height="35px" src="../../../assets/logo.png" />
              </v-flex>
              <h2>Unable to Verify email</h2>
              <p>{{ errorMessage }}</p>
              <v-layout row shrink>
                <v-btn large class="white-btn v-btn-with-radius"  to="/login">Login</v-btn>
                <v-btn large class="white-btn v-btn-with-radius" flat @click="resend">Resend Email</v-btn>
              </v-layout>
            </v-layout>
          </v-layout>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
import signUpService from '../service.js'

export default {
  name: 'verify',
  created() {
    if (this.$route.query) {
      this.token = this.$route.query.token
      this.email = this.$route.query.email
    }
  },
  data() {
    return {
      email: null,
      token: null,
      isLoading: true,
      error: false,
      errorMessage: '',
      emailResent: false,
    }
  },
  methods: {
    verifyToken() {
      if (this.token) {
        console.log(this.token)
        this.$Progress.start()
        signUpService.verify({ token: this.token })
          .then((response) => {
            this.$Progress.finish()
            this.isLoading = false
            this.verified = true
          })
          .catch((error) => {
            this.$Progress.finish()
            this.isLoading = false
            this.error = true
            this.errorMessage = error.data.message
          })
      }
    },
    resend() {
      this.$Progress.start()
      signUpService.resendVerifyEmail({ email: this.email })
        .then((response) => {
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          this.isLoading = false
          this.error = true
          this.errorMessage = error.data.message
        })
    },
  },
  watch: {
    token() {
      this.verifyToken()
    },
  },
}
</script>

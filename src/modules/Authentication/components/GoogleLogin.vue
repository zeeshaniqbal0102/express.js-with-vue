<template>
<v-flex class="ma-2">
  <img id="google-btn" height="50px" src="../../../assets/images/google_signin.png" v-on:mouseover="hover(this);" v-on:mouseout="unhover(this);" @click="init"/>
</v-flex>
</template>
<script>
import defaultImage from '../../../assets/images/google_signin_hover.png'
import hoverImage from '../../../assets/images/google_signin.png'
import authService from '../service.js'

export default {
  name: 'google-login',
  methods: {
    init() {
      this.$gAuth.getAuthCode()
        .then(async authCode =>
        // on success
        // return this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' })
          authService.Google.getToken({ authCode }))
        .then((response) => {
          this.$emit('response', response)
        })
        .catch((error) => {
          console.log('error', error)
          if (error.status && error.status === 404) {
          // So google login was fine, they just don't have an account. Lets pass them to the registration page
            this.$toasted.error('No account found.', {
              position: 'top-right',
              showHideTransition: 'slide',
              duration: 2000,
            })

            if (error.data && error.data.payload) {
              const { payload } = error.data
              // We can still see the google data for their sign up
              this.$router.push({
                name: 'signup',
                params: {
                  firstName: payload.given_name,
                  lastName: payload.family_name,
                  email: payload.email,
                  verified: payload.email_verified,
                },
              })
            } else {
              this.$router.push('/signup')
            }
          } else if (error.error) {
          // Do nothing
            console.log('Pop up error most likely')
          } else {
            this.$emit('response', error)
          }
        })
    },
    hover(element) {
      document.getElementById('google-btn').setAttribute('src', defaultImage);
    },
    unhover(element) {
      document.getElementById('google-btn').setAttribute('src', hoverImage);
    },
  },
}
</script>

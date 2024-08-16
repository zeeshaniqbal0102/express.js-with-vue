<template>
  <div>
    <v-card width="350">
      <v-card-text>
        <div class="text-xs-center">
          <v-flex class="mb-3">
            <span class="subheading">{{ $t('labels.WelcomeBack') }}</span>
          </v-flex>
          <v-flex>
            <GoogleLogin v-on:response="checkResponse"></GoogleLogin>
          </v-flex>
          <v-flex class="mb-3">
            <span>{{ $t('labels.or') }}</span>
          </v-flex>
          <v-flex>
            <v-text-field
              data-cy="loginEmail"
              v-model="email"
              solo
              :error-messages="emailErrors"
              :label="$t('labels.email')"
            ></v-text-field>
          </v-flex>
          <v-flex>

            <v-text-field
              data-cy="loginPassword"
              solo
              v-model="password"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('labels.password')"
              v-on:keyup.enter.prevent="submit"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-flex>

          <v-btn
            data-cy="loginSubmitBtn"
            v-on:click.stop="submit"
            class="mt-3 mb-3 v-btn-with-radius"
            color="info"
            large
            block
          >{{ $t('buttons.login') }}</v-btn>

          <router-link data-cy="loginForgotPassword" style="text-decoration: none" to="/forgotPassword">Forgot Password</router-link>
        </div>
      </v-card-text>
      <v-card-actions class="pa-0 mt-4">
        <v-card width="100%" style="border-radius: 0 0 4px 4px;" color="#F3F8FC">
          <v-layout align-center justify-center column fill-heigh>
            <div class="text-xs-center mb-3 mt-3">
              {{ $t('labels.dontHaveAccount')}}
              <a href="javascript:void(0)" @click="signUp">
                <b data-cy="loginSignUp">Sign Up</b>
              </a>
            </div>
          </v-layout>
        </v-card>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import authService from '../service';
import GoogleLogin from './GoogleLogin';

const { validationMixin } = require('vuelidate');
const { required, email } = require('vuelidate/lib/validators');

export default {
  name: 'authentication-login',
  data() {
    return {
      showPassword: false,
      email: null,
      password: null,
    };
  },
  components: {
    GoogleLogin,
  },
  async created() {
    localStorage.removeItem(`${process.env.VUE_APP_STORAGE_PREFIX}token`);
  },
  methods: {
    ...mapActions('global', ['initOrganization']),
    signUp() {
      this.$router.push({ path: '/signup' });
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toasted.error('Invalid Input', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        });
      } else {
        this.$Progress.start();
        return authService
          .authenticate({
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            this.$Progress.finish();
            this.checkResponse(response);
          })
          .catch((error) => {
            this.$Progress.finish();
            console.log(error);
            this.$swal('Invalid Login');
          });
      }
    },
    checkResponse(response) {
      // set the organization id or ask for the selection
      if (
        response.data
        && response.data.user
        && response.data.user.Organizations.length === 1
      ) {
        return this.initOrganization(response.data.user.Organizations[0])
          .then(() => {
            this.$router.push({ path: '/' });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (
        response.data
        && response.data.user
        && response.data.user.Organizations.length > 1
      ) {
        this.$router.push({
          path: '/login/organization',
          name: 'authentication-select-organization',
          params: {
            Organizations: response.data.user.Organizations,
          },
        });
      } else if (response.data && response.data.user) {
        this.$router.push({ path: '/newOrganization' });
      } else {
        // Do nothing
        this.$toasted.error('Invalid Login Request', {
          position: 'top-right',
          showHideTransition: 'slide',
          duration: 2000,
        });
      }
    },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.email) errors.push('Email is not valid');
      if (!this.$v.email.required) errors.push('Email is required.');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push('Password is required.');
      return errors;
    },
  },
  mixins: [validationMixin],
  validations: {
    email: {
      email,
      required,
    },
    password: {
      required,
    },
  },
};
</script>

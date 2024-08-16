<template>
  <v-container grid-list-lg fluid>
    <TitleBar :title="$t('pageHeader.role')" />
    <v-layout row wrap>
      <v-flex xs12>
        <v-card flat class="outlined" :color="$style.card.background">
          <CardToolbar :title="$t('labels.editRole')" :isModal="false" />
          <v-card-text>
            <v-layout row wrap align-baseline>
              <v-flex xs12 sm2>
                <span class="font-weight-medium">{{ $t('labels.name') }}</span>
              </v-flex>
              <v-flex xs12 sm8>
                <v-text-field
                  type="text"
                  solo
                  hint="ie. Sales Manager, Junior, Read Only"
                  v-model="role.name"
                  @focus="$event.target.select()"
                  :hide-details="nameErrors.length === 0"
                  :error-messages="nameErrors"
                  :label="$t('labels.name')"
                  @input="$v.role.name.$touch()"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    <!-- Permissions -->
      <v-flex xs12>
        <v-card class="outlined" flat>
           <v-expansion-panel class="elevation-0">
             <v-expansion-panel-content v-for="(permission, i) in Object.keys(newPermissions)">
              <template v-slot:header>
                <span>{{ permission }}</span>
              </template>
              <v-card flat class="outlined" :color="$style.card.background">
                <v-card-text>
                   <v-layout
                    row
                    wrap
                    align-center
                    v-for="permission in Object.entries(newPermissions)[i][1]"
                    :key="permission.id"
                  >
                    <v-flex grow xs12 md9 lg10>
                      <span class="font-weight-medium">{{ permission.name }}</span>
                      <p class="font-weight-light">{{ permission.description }}</p>
                    </v-flex>
                    <v-flex shrink xs12 md3 lg2>
                      <v-layout row align-center>
                        <v-flex shrink>
                          OFF
                        </v-flex>
                        <v-flex shrink>
                          <v-switch hide-details class="ma-0"
                        v-model="permission.allow"
                        color="teal"
                      ></v-switch>
                        </v-flex>
                        <v-flex shrink>
                          ON
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
           </v-expansion-panel>
        </v-card>
      </v-flex>

   
   
    </v-layout>

    <v-card-actions :style="{ 'background-color': $style.card.action }">
      <v-spacer></v-spacer>
      <v-btn flat class="text-capitalize" @click.stop.prevent="cancel">{{
        $t('buttons.cancel')
      }}</v-btn>

      <v-btn
        color="pink"
        dark
        class="v-btn-with-radius"
        @click.stop.prevent="submit('close')"
        >{{ $t('buttons.update') }}</v-btn
      >
    </v-card-actions>
  </v-container>

  <!-- <div>
    

    <v-footer color="white" height="60" clipped-right
      fixed bottom
      >
      <v-layout justify-end row v-if="!isModal">
        <v-btn color="info" flat @click="cancel" >{{ $t('buttons.cancel') }}</v-btn>
        <v-btn color="info" @click="submit">{{ $t('buttons.save') }}</v-btn>
      </v-layout>
    </v-footer>
  </div> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import roleService from '../service'
import employeeService from '../../../service.js'
import Loading from '../../../../../components/LoadingDialog'
import _ from 'lodash';
const { validationMixin } = require('vuelidate')
const { required, minLength, email, requiredIf } = require('vuelidate/lib/validators')

export default {
  name: 'role-edit',
  props: {
    isModal: Boolean,
  },
  data() {
    return {
      newPermissions: [],
      isLoading: false,
      permissions: [],
      role: {
        id: null,
        name: null,
      },
    }
  },
  components: {
    Loading,
  },
  async created() {
    this.isLoading = true
    await employeeService.getTerminalPermissions().then(response => {
      this.permissions = response.data
      Promise.all(
        this.permissions.map(permission => {
          permission.allow = true
        }),
      )
      this.newPermissions = _.mapValues(
        _.groupBy(this.permissions, permission =>
          permission.TPermissionGroup.name
        ),
        list => {
          return list;
        }
      );
    })
    await this.loadRole()
    this.isLoading = false
  },  
  computed: {
    ShiftList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/shift',
      )
    },
    InvoiceList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/invoice',
      )
    },
    ProductList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/product',
      )
    },
    HomeList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/home',
      )
    },
    SettingList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/settings',
      )
    },
    ExpenseList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/expense',
      )
    },
    ReportList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/reports',
      )
    },
    PaymentList() {
      return this.permissions.filter(
        permission => permission.TPermissionGroup.resource === '/payment',
      )
    },
    nameErrors() {
      const errors = []
      if (!this.$v.role.name.$dirty) return errors
      if (!this.$v.role.name.required) errors.push(this.$t('validations.fieldIsRequired'))
      if (!this.$v.role.name.minLength)
        errors.push(this.$t('validations.fieldMustbeatLeast4ChrLong'))
      return errors
    },
  },
  methods: {
    checkAllowState(val) {
      console.log('walop', val)
      return true
    },
    loadRole() {
      if (!this.$route.params || !this.$route.params.id)
        return this.$router.push('/employee/role')
      const { id } = this.$route.params
      this.$Progress.start()
      roleService.getById(id).then(response => {
        this.$Progress.finish()
        this.role.id = response.data.id
        this.role.name = response.data.name

        Promise.all(
          response.data.EmployeeRolePermissions.map(permission => {
            const foundIndex = this.permissions.findIndex(
              element => permission.TerminalPermissionId === element.id,
            )
            if (foundIndex >= 0) this.permissions[foundIndex].allow = permission.allow
          }),
        )
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
        this.role.Permissions = this.permissions
        roleService
          .update(this.role.id, this.role)
          .then(response => {
            this.$swal
              .mixin({
                toast: true,
                showConfirmButton: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'success',
                title: this.$t('toastMessage.text.roleUpdated'),
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
    role: {
      name: {
        required,
        minLength: minLength(4),
      },
    },
  },
}
</script>

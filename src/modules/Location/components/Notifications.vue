<template>
  <v-card>
    <v-card-text v-if="!isLoading">
      Notifications
      <v-list></v-list>
      <div v-for="notification in notifications" :key="notification.id">
        <v-layout row align-baseline="">
          <v-flex>
            <b>{{ notification.name }}</b>
            <p>{{ notification.description }}</p>
          </v-flex>
          <v-spacer></v-spacer>
          <v-btn
            v-if="
              notification.NotificationSetting && notification.stringId === 'SALESALERT'
            "
            class="v-btn-with-radius"
            color="teal"
            dark
            @click="enableNotificationOpen(notification)"
            >{{ $t('buttons.edit') }}</v-btn
          >
          <div v-if="!notification.NotificationSetting">
            <v-btn
              class="v-btn-with-radius"
              color="info"
              @click="enableNotificationOpen(notification)"
              >{{ $t('buttons.enable') }}</v-btn
            >
          </div>
          <div v-else>
            <v-btn
              class="v-btn-with-radius"
              color="error"
              @click="disableNotification(notification)"
              >{{ $t('buttons.disable') }}</v-btn
            >
          </div>
          <div v-if="notification.stringId === 'NIGHTLYSALE'">
          <v-btn                   
              class="v-btn-with-radius"
              color="info"                         
              @click="editNotificationOpen(notification)"             
              >{{ $t(Emails) }}</v-btn
            >
          </div>
          
          <!-- <v-flex shrink>
              <v-checkbox v-model="permission.allow"></v-checkbox>
            </v-flex> -->
        </v-layout>
        <v-divider></v-divider>
        <v-dialog 
        v-if="editNotification.dialog"
        v-model="editNotification.dialog"
        persistent
        max-width="500px">        
        <div >
         <v-card :color="$style.card.background" >
           <CardToolbar
          :title="'addEmails'"
          :isModal="true"
          @cancel="editNotificationClose"
        />
           <v-card-text>
                <v-label >{{ emailAlert }}</v-label>
                <v-layout row align-baseline="" :key="notification.id"  class="pa-1" xs12 md12 >
                  <v-flex >
                    <v-text-field
                        v-model="editAlert.name"
                        class="pa-1"
                        label="Name"                        
                        hint="ie. name"
                        :error-messages='notificationNameErrors'
                        @input="$v.editAlert.name.$touch()"                                                                              
                    ></v-text-field>  
                  <v-text-field
                        v-model="editAlert.email"
                        class="pa-1"                     
                        hint="ie. CellSmart@live.com"                                           
                        :label="$t('labels.email')"
                        :error-messages='notificationEmailErrors'                         
                        @input="$v.editAlert.email.$touch()"                         
                    ></v-text-field>
                    <v-btn
                        class="v-btn-with-radius"
                        color="info"   
                        @click="addEmails()"          
                    >{{ $t('buttons.add') }}</v-btn>
                  </v-flex>
              </v-layout>
              <v-layout row align-baseline=""   class="pa-1" xs12 md12 >                
                <v-flex >
                  <v-list>
                    <v-label v-bind:style="{ color: activeColor }" >{{ checkEmail }}</v-label>
                    <template v-for="(email, index) in editAlert.emailList" >
                      <v-list-tile :key="index">
                        <v-list-tile-content>{{ email }}</v-list-tile-content>                        
                        <v-list-tile-action>
                          <v-btn
                            fab
                            flat
                            @click.stop.prevent="editAlert.emailList.splice(index, 1)"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </template>
                   </v-list>
                </v-flex>           
              </v-layout>
            </v-card-text>
            <CardActions
              name="editAlert"     
              @submit="editNotificationSubmit"   
              @cancel="clear"
            />
          </v-card>
          
        </div>
        
      </v-dialog>  
      </div>
    </v-card-text>
    <v-dialog
      persistent
      v-if="enableNotification.dialog"
      v-model="enableNotification.dialog"
      max-width="500px"
    >
      <v-card v-if="enableNotification.Notification.stringId === 'NIGHTLYSALE'">
        <v-card-text>
          <div v-if="currentUser.email">
            Enabling will send {{ enableNotification.Notification.name }} to
            {{ currentUser.email }}
          </div>
          <div v-else>
            Your email is not set up.
          </div>

          <v-layout justify-end row>
            <v-btn color="info" flat @click="enableNotificationClose">{{
              $t('buttons.cancel')
            }}</v-btn>
            <v-btn color="info" @click="enableNotificationSubmit">{{
              $t('buttons.save')
            }}</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-card
        :color="$style.card.background"
        v-else-if="enableNotification.Notification.stringId === 'SALESALERT'"
      >
        <CardToolbar
          :title="$t('labels.salesAlerts')"
          :isModal="true"
          @cancel="enableNotificationClose"
        />
        <v-card-text>
          <v-card>
            <v-card-text>
              <h3 class="subheading mb-2">{{ $t('labels.phoneNumber') }}</h3>
              <p v-if="salesAlert.phoneNumbers.length >= 2">
                {{ $t('labels.limitedto2PhoneNumber') }}
              </p>
              <v-flex v-else>
                <v-layout row wrap>
                  <v-flex>
                    <v-text-field
                      solo
                      clearable     
                      :error-messages="phoneNumberErrors"                 
                      mask="phone"
                      dense
                      v-model="salesAlertDialog.phoneNumber"
                    ></v-text-field>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn
                      color="teal"
                      class="v-btn-with-radius"
                      @click="addSalesAlertPhoneNumber"
                      dark                      
                      :disabled="salesAlert.phoneNumbers.length >= 2"
                      >{{ $t('buttons.add') }}</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-list>
                  <template v-for="(number, index) in salesAlert.phoneNumbers">
                    <v-list-tile :key="number">
                      <v-list-tile-content>{{ number | phone }}</v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn
                          fab
                          flat
                          @click.stop.prevent="salesAlert.phoneNumbers.splice(index, 1)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-text>
          <v-card>
            <v-card-text>
              <h3 class="subheading mb-2">{{ $t('labels.times') }}</h3>
              <p v-if="salesAlert.times.length >= 3">
                {{ $('labels.limitedTo3Alerts') }}
              </p>
              <v-flex v-else>
                <v-time-picker
                  landscape
                  full-width
                  v-model="salesAlertDialog.time"
                ></v-time-picker>
                <v-btn
                  block
                  color="teal"
                  class="v-btn-with-radius"
                  dark
                  @click="addSalesAlertTime"
                  :disabled="!salesAlertDialog.time || salesAlert.times.length >= 3"
                  >{{ $t('buttons.add') }}</v-btn
                >
              </v-flex>
              <v-flex>
                <v-list>
                  <template v-for="(time, index) in salesAlert.times">
                    <v-list-tile :key="time.cron">
                      <v-list-tile-content>{{ time.label }}</v-list-tile-content>
                      <v-list-tile-action>
                        <v-btn
                          fab
                          flat
                          @click.stop.prevent="salesAlert.times.splice(index, 1)"
                        >
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-card-text>
        <CardActions
          name="saleAlert"
          @submit="enableNotificationSubmit"
          @cancel="enableNotificationClose"
        />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import locationService from '../service'
import settingsService from '../../Settings/service'
import { mapGetters, mapActions } from 'vuex'
const { validationMixin } = require('vuelidate')
const { required, minLength, email  } = require('vuelidate/lib/validators')

export default {
  name: 'location-view-notifications',
  props: ['LocationId', 'location'],
  data() {
    return {
      activeColor: 'red',
      isLoading: false,
      addemailDialog1:false,
      Emails:'Add Emails',
      notifications: {},
      currentNotifications: null,
      checkEmail:null,
      emailAlert:null,         
      editNotification: {
        dialog: false,
      },
      editAlert: {
        name:'',
        email:'',
        emailList:[],
      },
      enableNotification: {
        dialog: false,
      },
      salesAlertDialog: {
        phoneNumber: '',
        time: null,
      },
      salesAlert: {
        phoneNumbers: [],
        times: [],
        service: 'twilio',
      },
    }
  },
  mixins: [validationMixin],
  validations: {
      salesAlertDialog:{
        phoneNumber:{         
          required,     
          minLength: minLength(10),
        },
      },
      editAlert: {
        name: {
          required,
        },
        email: {
          required,
          email,
        },
      },     
  },
  computed: {
   ...mapGetters('global', ['currentUser']),   
   phoneNumberErrors() {
      const errors = []
      if (!this.$v.salesAlertDialog.phoneNumber.$dirty) return errors;   
      if (!this.$v.salesAlertDialog.phoneNumber.required) errors.push(this.$t('validations.fieldIsRequired'));
      if (!this.$v.salesAlertDialog.phoneNumber.minLength)  errors.push(this.$t('validations.validLetters10'));
      return errors;
    },
     notificationNameErrors() {
      const errors = [];
      if (!this.$v.editAlert.name.$dirty) return errors;
      if (!this.$v.editAlert.name.required) errors.push(this.$t('validations.fieldIsRequired'));
      return errors;
    },
    notificationEmailErrors() {    
      const errors = [];
      if (!this.$v.editAlert.email.$dirty) return errors;
       if (!this.$v.editAlert.email.required) errors.push(this.$t('validations.fieldIsRequired'));
      if (!this.$v.editAlert.email.email) errors.push(this.$t('validations.emailIsNotValid'));
      return errors;
    },
  },
  async created() {
    await this.loadNotifications();
  },
  methods: {
    async addEmails(){     

        //var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;      
        var mailformat = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;      
   
        if (this.editAlert.name == '' || this.editAlert.email == '' || !this.editAlert.email.match(mailformat)) 
        {
          if (this.$v.$invalid) {            
            this.$swal
              .mixin({
                toast: true,
                position: 'top-end',
                timer: 3000,
              })
              .fire({
                type: 'error',
                title: this.$t('toastMessage.text.invalidFields'),
              });
              return false;
          }
        }
        //else
        {
            /*if(this.editAlert.name == '')
            {
              this.checkEmail = "Name Should not be Empty";
              return;
            }

            if(this.editAlert.email == '')
            {
              this.checkEmail = "Email Should not be Empty";
              return;
            }
            */            
            if(this.editAlert.emailList.length >= 5)
            {
              this.checkEmail = "can not store more then 5 emails";
              return;
            }
            else
            {
              let val =  this.editAlert.name + '-' +  this.editAlert.email;
             
              //let val = name + '-' + email;

              var nameEmails = this.editAlert.emailList.map(function(i) {                
                return String(i).split('-').pop();//i;
              });
             
              
              if(nameEmails.indexOf(this.editAlert.email) !== -1){              
                this.checkEmail = "Email already Exits";
                return;
              } else{
                console.log("Email is not Duplicate!")
                this.checkEmail =null;
                await this.editAlert.emailList.push(val);

                this.editAlert.name = '';
                this.editAlert.email = ''; 
              }   
            }
          }
      //}
    },
    async loadNotifications() {
      this.isLoading = true
      await settingsService.Notification.getAll().then(async response => {
        await Promise.all(
          response.data.map(notification => {
            this.notifications[notification.id] = notification
          }),
        )
      })
      await locationService.Settings.Notifications.get(this.LocationId).then(
        async response => {
          this.currentNotifications = response.data

          await Promise.all(
            response.data.map(setting => {
              if (this.notifications[setting.NotificationId])
                this.notifications[setting.NotificationId].NotificationSetting = setting
            }),
          )        
          //console.log('s',response.data);
          if(response.data != ''){             
            
              if(response.data[0].metadata)
              {
                if(response.data[0].metadata.emailList ? response.data[0].metadata.emailList.length : '0' > 0)
                {              
                  this.Emails = 'View Emails'
                }
              }

          }else
          {
           this.Emails = 'Add Emails'
           this.clear();
          }           
        },
      )
      this.isLoading = false
    },

    editNotificationOpen(notification) {
      //alert('edit notification');
      //console.log('edit notification',notification);
      this.editNotification.Notification = notification
      this.editNotification.dialog = true
      this.editNotification.NotificationSetting = {
        NotificationId: notification.id,
        metadata: {},
        ...this.editNotification.Notification.NotificationSetting,
      }
     
      if (this.editNotification.Notification.stringId === 'NIGHTLYSALE') {
        this.editAlert = {
          ...this.editAlert,
          ...this.editNotification.NotificationSetting.metadata,
        }
      }
       //console.log('notificatoin setting',this.editAlert);
    },
    async editNotificationSubmit() {     
      
      if (this.editNotification.Notification.stringId === 'NIGHTLYSALE') {
          console.log(this.editAlert.emailList);
          
          if(this.editAlert.emailList.length === 0)
          {
            this.checkEmail = "Please Select Email";
          }else{
        
          this.editNotification.NotificationSetting = {
            ...this.editNotification.NotificationSetting,
            //metadata: this.editAlert,
            //metadata: this.editAlert.emailList,
            metadata: this.editAlert,
          }
          
          //console.log('editNotification',this.editNotification.NotificationSetting.NotificationId);        
          await locationService.Settings.Notifications.set(
            this.LocationId,
            this.editNotification.NotificationSetting,
            
          ).then(() => {
          this.$swal
            .mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: true,
              timer: 2000,
            })
            .fire({
              type: 'success',
              title: 'Emails for Notification was Save Succesfully',
            });
            this.addemailDialog1= false;
            })
            .catch(() => {
              this.$swal
                .mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: true,
                  timer: 2000,
                })
                .fire({
                  type: 'error',
                  title: 'Emails for Notification was not Save',
                });            
              });
 
          this.editNotificationClose()
          this.loadNotifications()
        }
      }
    },
    editNotificationClose() {
      this.editNotification = {
        dialog: false,
      }      
    },
    enableNotificationOpen(notification) {
     
      this.enableNotification.Notification = notification
      this.enableNotification.dialog = true
      this.enableNotification.NotificationSetting = {
        NotificationId: notification.id,
        metadata: {},
        ...this.enableNotification.Notification.NotificationSetting,
      }
      if (this.enableNotification.Notification.stringId === 'SALESALERT') {
        this.salesAlert = {
          ...this.salesAlert,
          ...this.enableNotification.NotificationSetting.metadata,
        }
      }
    },
    clear(){
    
      this.editAlert.name = '';
      this.editAlert.email = '';
      this.editAlert.emailList = [];
      this.editNotificationClose();
    },
    async enableNotificationSubmit() {
      
      if (this.enableNotification.Notification.stringId === 'NIGHTLYSALE') {

        
          /*this.$swal
            .mixin({
              toast: true,
              showConfirmButton: true,
              position: 'top-end',
              timer: 3000,
            })
            .fire({
              type: 'error',
              title: this.$t('validations.youAtLeastNeed1PhoneNumberToSave'),
            })
          return false*/
      

      }
      if (this.enableNotification.Notification.stringId === 'SALESALERT') {
        if (this.salesAlert.times.length === 0) {
          this.$swal
            .mixin({
              toast: true,
              showConfirmButton: true,
              position: 'top-end',
              timer: 3000,
            })
            .fire({
              type: 'error',
              title: this.$t('validations.youAtLeastNeed1TimeToSave'),
            })
          return false
        }
        if (this.salesAlert.phoneNumbers.length === 0) {
          this.$swal
            .mixin({
              toast: true,
              showConfirmButton: true,
              position: 'top-end',
              timer: 3000,
            })
            .fire({
              type: 'error',
              title: this.$t('validations.youAtLeastNeed1PhoneNumberToSave'),
            })
          return false
        }

        this.enableNotification.NotificationSetting = {
          ...this.enableNotification.NotificationSetting,
          metadata: this.salesAlert,
        }
      }
      await locationService.Settings.Notifications.set(
        this.LocationId,
        this.enableNotification.NotificationSetting,
      )
      this.enableNotificationClose()
      this.loadNotifications()
    },
    enableNotificationClose() {
      this.enableNotification = {
        dialog: false,
      }
    },
    async disableNotification(notification) {
      await locationService.Settings.Notifications.remove(
        this.LocationId,
        notification.NotificationSetting.id,
      )
      this.loadNotifications()
    },
    addSalesAlertPhoneNumber() {
      
      if (this.salesAlertDialog.phoneNumber.length === 0) 
      {
        this.$v.$touch()
        if (this.$v.$invalid) {
        this.$swal
          .mixin({
            toast: true,
            showConfirmButton: true,
            position: 'top-end',
            timer: 3000,
          })
          .fire({
            type: 'error',
            title: this.$t('toastMessage.text.missingFields'),
          })
       } 
      }else {
        
        this.salesAlert.phoneNumbers.push(this.salesAlertDialog.phoneNumber)
        this.salesAlertDialog.phoneNumber = ''
      }
    },
    addSalesAlertTime() {
      console.log(this.salesAlertDialog.time)

      const timezone = this.$moment.tz.guess()

      this.salesAlert.times.push({
        time: this.salesAlertDialog.time,
        timezone,
        label: this.$moment(`2019-01-01T${this.salesAlertDialog.time}:00`).format(
          'hh:mm a',
        ),
      })
      this.salesAlertDialog.time = null
    },
  },  
}
</script>

<style></style>

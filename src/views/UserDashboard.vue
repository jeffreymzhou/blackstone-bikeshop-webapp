<template>
  <div class="container">
    <div class=row>
      <b-jumbotron class="container-fluid">
        <h2>
          User Dashboard: {{ currentUser.firstName }} {{ currentUser.lastName }}
        </h2>
      </b-jumbotron>
    </div>   
    <div class="row">
      <div class="col-md-3">
        <b-card>
          <h3>
          {{ date }}
        </h3>
        <button @click="checkIn()" class="btn btn-success" :disabled="checkedIn">
          Check in
        </button>
        <b-button v-b-modal.modal-1 class="btn btn-success" :disabled="!checkedIn" @click="fillTimeFields()">
          Check out
        </b-button>

        <b-modal id="modal-1" title="Blackstone Shift Summary:" hide-footer>
          <div class="row">
            <div class="col-md-6">
              <h5>
                Time In: {{ this.timeIn }} 
              </h5>
              <h5>
                Time Out: {{ parseTime(new Date()) }} 
              </h5>
            </div>
            <div class="col-md-6">
              <h5>
                Total Time: {{ this.timeDiff }}  
              </h5>
            </div>
          </div>
            <b-card bg-variant="light">
              <b-form-group
                  label-cols-sm="4"
                  label="Class:"
                  label-align-sm="left"
                  label-for="class"
                >
                <b-form-input 
                  id="class"
                  v-model="timeLog.activities.class"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="4"
                label="Bike Ride:"
                label-align-sm="left"
                label-for="bikeride"
              >
                <b-form-input  
                  id="bikeride"
                  v-model="timeLog.activities.bikeRide"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="4"
                label="Shop Support:"
                label-align-sm="left"
                label-for="shopsupport"
              >
                <b-form-input 
                  id="shopsupport"
                  v-model="timeLog.activities.shopSupport"
                >
                </b-form-input>
              </b-form-group>

              <b-form-group
                label-cols-sm="4"
                label="Friday Electives:"
                label-align-sm="left"
                label-for="fridayelectives"
              >
                <b-form-input 
                  id="fridayelectives"
                  v-model="timeLog.activities.fridayElectives"
                >
                </b-form-input>
              </b-form-group>
            </b-card>
        <b-button class="mt-3" block @click="$bvModal.hide('modal-1'); checkOut();">
          Submit
        </b-button>
        </b-modal>
        </b-card>
      </div>
      <div class="col-md-6">
        <h3>
          WorkLog
        </h3>
        <div class="row mt-3">
          <b-form-group class="col-md-5">
            <b-form-select v-model="worklogFilter.type" :options="worklogTypeOptions" size="sm"></b-form-select>
          </b-form-group>
          <b-form-group class="col-md-5">
            <b-form-select v-model="worklogFilter.timeFrame" :options="worklogTimeOptions" size="sm"></b-form-select>
          </b-form-group>
          <b-form-group class="col-md-2">
            <b-button class="btn btn-primary btn-block" size="sm" >
              Filter
            </b-button>
          </b-form-group>
        </div>
        <b-list-group>
          <b-list-group-item
            v-for="(t, index) in transactions"
            :key="index"
            class="text-left"
            :disabled="'requested' === t.status"
          >
            <div class="row">
              <div class="col-md-3">
                <p style="color: grey; font-size: 14px;">{{ t.date }}</p>
              </div>
              <div class="col-md-3">
                Volunteer
              </div>
              <div class="col-md-3">
                In: {{ t.timeIn }} </br>
                Out: {{ t.timeOut }}
              </div>
              <div class="col-md-3">
                <p style="color: green; font-size: 14px;">+12</p><p style="color: grey; font-size: 14px;">/145</p>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-md-3">
        <h3>
          Current total hours:
        </h3>
        <h4>
          Hours earned this week:
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      worklogTypeOptions:[
        { value: null, text: 'All types' },
        { value: 'Hours Earned', text: 'Hours Earned' },
        { value: 'Purchases', text: 'Purchases' },
      ],
      worklogTimeOptions:[
        { value: null, text: 'All history' },
        { value: 'Past week', text: 'Past week' },
        { value: 'Past month', text: 'Past month' },
      ],
      worklogFilter:{
        type: null,
        timeFrame: null
      },
      currentUser: null,
      transactions: null,
      dummyTransactions:{
        trans1:{
          date: '5-1-19',
          checkIn: 5,
          checkOut: 10,
          hoursEarned: 5,
          status: 'requested'
        },
        trans2:{
          date: '5-1-19',
          checkIn: 3,
          checkOut: 5,
          hoursEarned: 2,
          status: 'requested'
        },
        trans3:{
          date: '5-1-19',
          checkIn: 3,
          checkOut: 7,
          hoursEarned: 4,
          status: 'approved'
        },
        trans4:{
          date: '5-1-19',
          checkIn: 1,
          checkOut: 5,
          hoursEarned: 4,
          status: 'approved'
        },
        trans5:{
          date: '5-1-19',
          checkIn: 3,
          checkOut: 8,
          hoursEarned: 5,
          status: 'approved'
        }
      },
      today: {
        month: null,
        day: null,
        year: null,
        time: null
      },
      date: null,
      todayTimeStamp: null,
      checkedIn: false,
      timeLog: {
        userId: this.$route.params.id,
        timeIn: null,
        timeOut: null,
        hourChange: null,
        activities: {
          class: null,
          bikeRide: null,
          shopSupport: null,
          fridayElectives: null    
        }
      },
      timeIn: null,
      timeDiff: null,
    }
  },
  methods: {
    async fetchTransactions(){
      var snapshot = await db.collection("transactions").where("userId", "==", this.$route.params.id).get()
      this.transactions = snapshot.docs.map(doc => this.parseTransaction(doc))
    },
    parseTransaction(d){
      if(d === null){
        return ''
      }else{
        var x = this.parseTime((d.data().timeIn).toDate())
        var y =  this.parseTime((d.data().timeOut).toDate())
        var z = this.parseDate((d.data().timeIn).toDate()) 
        var t = {
        timeIn: x,
        timeOut: y,
        date: z
      }
      return t
      }
    },
    async fetchCurrentUser(){
      var snapshot = await db.collection('users').doc(this.$route.params.id).get()
      this.currentUser = snapshot.data()
    },
    fetchDateTime(){
      var d = new Date()
      var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes()
      var hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
      var ampm = d.getHours() >= 12 ? 'pm' : 'am'
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      this.date = days[d.getDay()]+' '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear()+' '+hours+':'+minutes+ampm
    },
    parseDate(d){
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      return (d.getMonth()+1)+'-'+d.getDate()+'-'+d.getFullYear()
    },
    parseTime(d){
      if(d === null){
        return ''
      }else{
        var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes()
        var hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
        var ampm = d.getHours() >= 12 ? 'pm' : 'am'
        return hours+':'+minutes+' '+ampm
      }
    },
    calcTimeDiff(x, y){
        var d = (y.getTime() - x.getTime())/1000
        var minutes = Math.round((d%3600)/60)
        var hours = Math.round(d/3600)
        return hours+" hrs "+ minutes +" mins"
    },
    checkIn(){
      this.timeLog.timeIn = new Date()
      this.checkedIn = !this.checkedIn
    },
    checkOut(){
      this.timeLog.timeOut = new Date()
      this.timeLog.hourChange = 5
      db.collection("transactions").add(this.timeLog)
      this.checkedIn = !this.checkedIn
    },
    timeLogComplete(){
      if((this.timeLog.hours.activity1 === null)||
      (this.timeLog.hours.activity2 === null)||
      (this.timeLog.hours.activity3 === null)||
      (this.timeLog.hours.activity4 === null)){
        return false
      }else{
        return true
      }
    },
    fillTimeFields(){
      this.timeDiff = this.calcTimeDiff(this.timeLog.timeIn, new Date())
      this.timeIn = this.parseTime(this.timeLog.timeIn)
      this.timeLog.timeOut = new Date()
    }
  },
  mounted(){
    this.fetchDateTime()
    this.fetchTransactions()
  },
  created(){
    this.fetchCurrentUser()
  }

}
</script>

<template>
  <div class="container" style="padding-bottom: 20px;">
    <div class="row">
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
          <b-form-group class="col-md-6">
            <b-form-select v-model="worklogFilter.type" :options="worklogTypeOptions" size="sm"></b-form-select>
          </b-form-group>
          <b-form-group class="col-md-6">
            <b-form-select v-model="worklogFilter.timeFrame" :options="worklogTimeOptions" size="sm"></b-form-select>
          </b-form-group>
        </div>
        <b-list-group>
          <b-list-group-item
            v-for="(t, index) in filteredTrans"
            :key="index"
            class="text-left"
            :disabled="'requested' === t.status"
          >
            <div class="row">
              <div class="col-md-3">
                <p style="color: grey; font-size: 14px;">{{ parseDate(new Date(t.timeIn)) }}</p>
              </div>
              <div class="col-md-3">
                {{ t.type }}
              </div>
              <div class="col-md-4">
                In: {{ parseTime(new Date(t.timeIn)) }} <br>
                Out: {{ parseTime(new Date(t.timeOut)) }}
              </div>
              <div class="col-md-2">
                <span 
                  style="font-size: 14px;" 
                  :class="parseHours(new Date(t.timeChange)) > 0 ? 'earning' : 'purchase'"
                >
                  {{ parseHours(new Date(t.timeChange)) > 0 ? '+' : '-' }} {{Math.abs(parseHours(new Date(t.timeChange))) }}
                </span>
                <font size="2" color="grey">/{{t.currTotal}}</font>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-md-3">
        <h3>
          Current total hours: {{ this.totalHours }}
        </h3>
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
        { value: 1, text: 'Hours Earned' },
        { value: -1, text: 'Purchases' },
      ],
      worklogTimeOptions:[
        { value: null, text: 'All history' },
        { value: 8, text: 'Past week' },
        { value: 31, text: 'Past month' },
      ],
      worklogFilter:{
        type: null,
        timeFrame: null
      },
      currentUser: null,
      transactions: [],
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
        type: null,
        timeChange: null,
        activities: {
          class: null,
          bikeRide: null,
          shopSupport: null,
          fridayElectives: null    
        }
      },
      timeIn: null,
      timeDiff: null,
      totalHours: 0
    }
  },
  computed: {
    filteredTrans() {
      var filtered = this.transactions
      if(this.worklogFilter.type){
        console.log("filtering type")
        filtered = filtered.filter(trans => trans.timeChange*this.worklogFilter.type > 0)
      }
      if(this.worklogFilter.timeFrame){
        filtered.forEach(trans => {
console.log(this.parseHours(new Date(Date.now() - trans.timeIn))/60)
        })
        
        filtered = filtered.filter(trans => this.parseHours(new Date(Date.now() - trans.timeIn))/60 < this.worklogFilter.timeFrame)
      }
      filtered = filtered.sort(function(a,b){
        return a.timeIn - b.timeIn
      })
      filtered.forEach(t => {
        this.totalHours = this.parseHours(t.timeChange) + this.totalHours 
        t.currTotal = this.totalHours
      })
      filtered = filtered.sort(function(a,b){
        return b.timeIn - a.timeIn
      })
      return filtered
    }
  },
  methods: {
 //   async fetchTransactions(){
  //    var snapshot = await db.collection("transactions").where("userId", "==", this.$route.params.id).get()
 //     this.transactions = snapshot.docs.map(doc => this.parseTransaction(doc))
 //   },
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
    parseHours(d){
      if(d === null){
        return ''
      }else{
        return Math.round(d / (1000))
      }
    },
    calcTimeDiff(x, y){
        var d = (y.getTime() - x.getTime())/1000
        var minutes = Math.round((d%3600)/60)
        var hours = Math.round(d/3600)
        return hours+" hrs "+ minutes +" mins"
    },
    checkIn(){
      this.timeLog.timeIn = Date.now()
      this.timeLog.latest = true
      this.timeLog.type = "volunteer"
      this.timeLog.status = "requested"
      this.checkedIn = !this.checkedIn
      db.collection('transactions').add(this.timeLog)
    },
    checkOut(){
      db.collection('transactions').where("userId", "==", this.$route.params.id).where("latest", "==", true)
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id)
          var timeIn = doc.data().timeIn
          db.collection('transactions').doc(doc.id).update({
            timeOut: Date.now(),
            timeChange: Date.now() - timeIn,
            latest: false
          })
        })
        this.checkedIn = !this.checkedIn
      })
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
  },
  created(){
    this.fetchCurrentUser()
    db.collection('transactions').where("userId", "==", this.$route.params.id).where("latest", "==", false).onSnapshot(res => {
      const changes = res.docChanges() //the documents that have been changed in firestore
      changes.forEach(change => {
        if (change.type === 'added') {
          var t = change.doc.data()
          this.transactions.push({
            timeIn: t.timeIn,
            timeOut: t.timeOut,
            timeChange: t.timeChange,
            type: t.type,
            id: change.doc.id
          })
        }
      })
    })
  }

}
</script>

<style>
.earning {
  color: green;
}
.purchase {
  color: red;
}
</style>

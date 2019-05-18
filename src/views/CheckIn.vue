<template>
  <div>
    Check-in page
    <button class="btn btn-primary">
        Check In
    </button>
  </div>
</template>

<script>
export default {
  data(){
    return{

      timelog: {
        userID: null,
        timeIn: null,
        timeOut: null,
        }
    }
  },
  methods: {
    logCheckIn(){

    }

  }
}
</script>


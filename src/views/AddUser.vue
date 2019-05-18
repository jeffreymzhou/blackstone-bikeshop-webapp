<template>
  <div>
    <h1>
      Add user
    </h1>
    <b-form-input
      id="input-1"
      v-model="user.firstName"
      type="email"
      required
      placeholder="Enter first name"
    ></b-form-input>
    <b-form-input
      id="input-1"
      v-model="user.lastName"
      type="email"
      required
      placeholder="Enter last name"
    ></b-form-input>
      <button class="btn btn-primary" @click="addUser">
        Add User
      </button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      user: {
        firstName: null,
        lastName: null
      }      
    }     
  },
  methods: {
    addUser(){
      db.collection("users").add({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        dateAdded: new Date()
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    }
  }
}
</script>


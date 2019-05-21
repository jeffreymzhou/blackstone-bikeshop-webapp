<template>
  <div>
    <h1>
      All Users:
    </h1>
    <div class="container">
      <b-list-group>
        <b-list-group-item
          v-for="doc in allUserDocs"
          :key="doc.id"
          class="text-left"
        >
        <router-link :to="{ name: 'userdashboard', params: {id: doc.id } }"> 
          {{ doc.data().firstName }} {{ doc.data().lastName }} 
        </router-link>
          
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return{
            allUserDocs: null,
            filteredUsers: null
        }
    },
    methods: {
      async getAllUsers() {
        var snapshot = await db.collection('users').get()
        this.allUserDocs = snapshot.docs
      },
      filterUsers(){
        this.filteredUsers = db.collection('users').where()
      }
    },
    mounted(){
      this.getAllUsers()
    }
}
</script>


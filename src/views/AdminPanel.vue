<template>
	<div>
		ADMIN
		
	</div>
</template>

<script>
export default {
	data() {
		return {
			transactions: []
		}
	},
	methods: {

	},
	created(){
    db.collection('transactions').where("status", "==", 'requested').onSnapshot(res => {
      const changes = res.docChanges() //the documents that have been changed in firestore
      changes.forEach(change => {
        if (change.type === 'added') {
          var t = change.doc.data()
          this.transactions.push({
            timeIn: t.timeIn,
            timeOut: t.timeOut,
            timeChange: t.timeChange,
            id: change.doc.id
          })
        }
      })
    })
  }
}
</script>


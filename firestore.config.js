const firebaseConfig = {
    apiKey: "AIzaSyDyfYvSBCAuG6oV7DzmmYL-RZvo0aVIuTM",
    authDomain: "blackstone-bikeshop-webapp.firebaseapp.com",
    databaseURL: "https://blackstone-bikeshop-webapp.firebaseio.com",
    projectId: "blackstone-bikeshop-webapp",
    storageBucket: "blackstone-bikeshop-webapp.appspot.com",
    messagingSenderId: "803558091672",
    appId: "1:803558091672:web:9003ae9e7edd4df5"
  };

firebase.initializeApp(firebaseConfig)
  // firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
}
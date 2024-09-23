// Import the functions you need from the SDKs you 
const { initializeApp } = require("firebase/app")
const { getFirestore, collection, query, getDocs, addDoc, where } = require("firebase/firestore")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxF44T7BJ9SX9pyjw-DJ_vK6y6AVxz-i0",
    authDomain: "autotrander.firebaseapp.com",
    projectId: "autotrander",
    storageBucket: "autotrander.appspot.com",
    messagingSenderId: "752756829096",
    appId: "1:752756829096:web:2b53f1c997d74ef42f0b9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const userCollections = collection(db, 'Users');

module.exports.getUsers =  async function () {
    const userSnapshot = await getDocs(userCollections);
    const userList = userSnapshot.docs.map(doc => doc.data());
    return userList;
}

async function getSingleUser (email, password) {
    const querySnapshot = await getDocs(query(userCollections, where("email", "==", email), where("password", "==", password)));
    const data = querySnapshot.docs.map(doc => doc.data());
    return data[0]
}
module.exports.setUser = async function (email, password){
    let user = await getSingleUser(email, password)
    if(!user){
        addDoc(userCollections, {email, password})
        return "SuccessFully added"
    }else{
        throw new Error("already Added")
    }
}
module.exports.getSingleUser = getSingleUser

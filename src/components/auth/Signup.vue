<template>
    <div class="signup container">
        <form @submit.prevent="signup" class="card-panel">
            <h2 class="center deep-purple-text">
                Sign up!
            </h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <div class="field">
                <label for="Alias">Alias:</label>
                <input type="text" name="alias" v-model="alias">
            </div>
            <p class="red-text center" v-if="feedback">{{ feedback }}</p>
            <div class="field center">
                <button class="btn deep-purple">Sign up</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify'
import firebaseApp from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Signup',
    data(){
        return{
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null
        }
    },
    methods:{
        signup(){
            if(this.alias && this.email && this.password){
                //Slugify given alias, remove unwanted characters and replace with dashes, render lowercase.
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                //Check if given slugified alias exists within Firestore users collection, return appropriate feedback.
                let ref = firebaseApp.collection('users').doc(this.slug)
                ref.get().then(doc => {
                    if(doc.exists){
                        this.feedback = 'This alias already exists'
                    }
                    //If slugifed alias does not exist, create user in Fireauth
                    else{
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred => {
                            ref.set({
                                alias: this.alias,
                                geolocation: null,
                                user_id: cred.user.uid
                            })
                        })
                        //Redirect to homepage
                        .then( () =>{
                            this.$router.push({ name: 'GMap' })
                        })
                        .catch(err => {
                            console.log(err)
                            this.feedback = err.message
                        })
                        this.feedback = 'You may use this alias'
                    }
                })
            }
            else{
                this.feedback = "You must enter all fields."
            }
        }
    }
}
</script>

<style>
.signup{
    max-width: 400px;
    margin-top: 60px;
}
.signup h2{
    font-size: 2.4em;
}
.signup .field{
    margin-bottom: 16px;
}
</style>
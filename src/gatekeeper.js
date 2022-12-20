import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged, 
    getIdToken } from 'firebase/auth';
//import { ApiMessenger } from './ApiMessenger.js';
//import { apiConfig } from '../config/apiConfig.js';
import { emitMessage } from './utils.js';

class GateKeeper {
    constructor(authenticator) {
        if (this.instance) return this.instance;
        GateKeeper.instance = this;

        // In case User is already logged in (session active)
        // we populate user 
        if(sessionStorage.getItem('user_id')){
          //console.log("get user data when construct", sessionStorage.getItem('user_id'));
          let userId = sessionStorage.getItem('user_id');
          //this.getUserData(userId);
        }
        
        // At start we always listen to User's state changes
        this.createEventListeners(authenticator);
        this.listenToAuthChanges(authenticator);        
    }

    /*
    // TODO: add user management to app
    getUserData(userId) {
      let userMessenger = new ApiMessenger(apiConfig.apiRoute.users);
      
      if(sessionStorage.getItem('user_ready') == true) return;

      emitMessage("Retrieving your data", "#fff", 5000);
      userMessenger
        .get(`${userId}`)
        .then(response => {
          //console.log(response, response.status);
          if(response.status && response.status == 404){
            throw new Error("Utilisateur en cours de création.");
          } 
          return response.json();
        })
        .then(data => {
            //emitMessage("User data fetched", "#fff", 500);
            sessionStorage.setItem('user', JSON.stringify(data));
            sessionStorage.setItem('user_ready', true);
        })
        .catch(e => {
            //console.log({"status": e.status, "message": e.message});
            emitMessage(e.message, "#ec1c1c");
        });
    }
    */

    listenToAuthChanges(authenticator) {
      onAuthStateChanged(authenticator, (user) => {
        const authWrapper = document.querySelector('.auth');
        const authModals = document.querySelectorAll('.auth .modal');
        if (user) {
          authWrapper.classList.remove('open');
          authModals.forEach(modal => {
            modal.classList.remove('active');
          });
          /* We set userAuthenticatedToken once for the whole app */
          const userNameSpan = document.querySelectorAll('.userName');

          getIdToken(user)
            .then((token) => {
              // User is authenticated
              sessionStorage.setItem("user_id", user.uid);
              sessionStorage.setItem("user_token", token);

              const userDisplayName = user.displayName == null ? "{user}" : user.displayName;
              userNameSpan.forEach(span => {
                span.innerHTML = userDisplayName;
              });
              /* Utility to load data coming from Google Sheet POC */
              if(user.email == "marchaljeebs@gmail.com"){
                userNameSpan.forEach(span => {
                  span.innerHTML = "Jeebs";
                });
              }
            })
            .catch(e => {
              //console.log({"status": e.status, "message": e.message});
              emitMessage(e.message, "#ec1c1c");
              sessionStorage.clear();
            });    
        } else {
          authWrapper.classList.add('open');
          authModals[0].classList.add('active');

          sessionStorage.clear();
        }
        //console.log('User status changed, accessToken: ', user);
      });
    }

    createEventListeners(authenticator) {
      const authSwitchLinks = document.querySelectorAll('.switch');
      const authModals = document.querySelectorAll('.auth .modal');
      const registerForm = document.querySelector('.register');
      const loginForm = document.querySelector('.login');
      const logoutButton = document.querySelector('.sign-out');

      // toggle auth modals
      authSwitchLinks.forEach(link => {
        link.addEventListener('click', () => {
          authModals.forEach(modal => modal.classList.toggle('active'));
        });
      });
    
      // register form
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        
        createUserWithEmailAndPassword(authenticator, email, password)
          .then(user => {
            //console.log('registered', user.user);
            sessionStorage.setItem('user_ready', false);
            sessionStorage.setItem('user_id', user.user.uid);
            //this.getUserData(user.user.uid);
            registerForm.reset();
          })
          .catch(error => {
            registerForm.querySelector('.error').textContent = error.message;
          });
      });
    
      // login form
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
    
        signInWithEmailAndPassword(authenticator, email, password)
          .then(user => {
            //console.log('logged in', user);
            sessionStorage.setItem('user_ready', false);
            sessionStorage.setItem('user_id', user.user.uid);
            //this.getUserData(user.user.uid);
            loginForm.reset();
          })
          .catch(error => {
            loginForm.querySelector('.error').textContent = error.message;
          });
      });
    
      // sign out
      logoutButton.addEventListener('click', () => {
        signOut(authenticator)
          .then(() => {
            console.log('signed out');
            sessionStorage.clear();
          });
      });
        
    }    
}

export {GateKeeper};

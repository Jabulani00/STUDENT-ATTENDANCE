import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Declare variables to store form data
  email: string="";
  name: string="";
  surname: string="";
  studentNumber: string="";
  password: string="";

  // constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore,private navCtrl: NavController) {}
  constructor(private alertController: AlertController, private loadingController: LoadingController,
    private router: Router, private auth: AngularFireAuth, private toastController: ToastController,
    private navCtrl: NavController, private firestore: AngularFirestore){}

  ngOnInit() {
  }

  goToPage() {
    this.navCtrl.navigateForward("/login");
  }


  async register() {

    if(this.email==""){
      alert("enter email");
      return
    }
    if(this.password==""){
      alert("enter password");
      return
    }
     
    
     
    const loader = await this.loadingController.create({
      message: 'Signing up',
      cssClass: 'custom-loader-class'
    });
    await loader.present();





    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
         this.firestore.collection('registeredStudents').add({
          email: this.email,
          name : this.name,
          surname: this.surname,
          studentNumber: this.studentNumber,

        });
        loader.dismiss();

      


        this.router.navigateByUrl("/login");
        this.presentToast()
        
        // ...
      })
      .catch((error) => {
        loader.dismiss();
        const errorCode = error.code;
        const errorMessage = error.message;

        if(errorMessage=="Firebase: Error (auth/missing-email)."){

        }else if(errorMessage=="Firebase: The email address is badly formatted. (auth/invalid-email)."){
          alert("badly formatted e email");
        }else if(errorMessage=="Firebase: The email address is already in use by another account. (auth/email-already-in-use)."){
          alert("invalid email or password");
        }
        else if(errorMessage=="Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."){
          alert("invalid email");
        }else{
          alert(errorMessage);
        }

      });

  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'successfully registered!',
      duration: 1500,
      position: 'top'
    });

  }

  // Function to handle user registration
  // signUp() {
  //   // Create user with email and password
  //   this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
  //     .then((userCredential: { user: any; }) => {
  //       // User registration successful
  //       const user = userCredential.user;

  //       // Save additional user data to Firestore
  //       this.saveUserDataToFirestore(user.uid);
        
  //       console.log('User registration successful:', user);
  //     })
  //     .catch((error: { message: any; }) => {
  //       console.error('Error creating user:', error.message);
  //     });
  // }

  // // Function to save user data to Firestore
  // saveUserDataToFirestore(userId: string) {
  //   const formData = {
  //     email: this.email,
  //     name: this.name,
  //     surname: this.surname,
  //     studentNumber: this.studentNumber,
  //   };

  //   // Add user data to Firestore
  //   this.firestore.collection('users').doc(userId).set(formData)
  //     .then(() => {
  //       console.log('User data added to Firestore');
  //     })
  //     .catch((error: any) => {
  //       console.error('Error adding user data to Firestore:', error);
  //     });
  // }
}
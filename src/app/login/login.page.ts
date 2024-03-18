import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regular expression for email validation
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // regular expression for password validation
  userData: any;
  staffNumber: any;

  constructor(private db: AngularFirestore,private loadingController: LoadingController,
    private auth: AngularFireAuth,private navController: NavController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  async validate() {
    // Validate input
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Please enter your email.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate email format
    if (!this.emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: 'Please provide a valid email address.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // Validate password format
    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter your password.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }
  
    // If all validations pass, continue with sign-in logic
    //this.login();
  }

  
  async login() {
    const loader = await this.loadingController.create({
      message: 'Signing in',
      cssClass: 'custom-loader-class'
    });
  
    try {
      await loader.present();
  
      // Attempt to sign in using email and password
      const userCredential = await this.auth.signInWithEmailAndPassword(this.email, this.password);
  
      if (userCredential) {
        // Check if the user is a registered student
        const studentQuerySnapshot = await this.db.collection('registeredStudents')
          .ref.where('email', '==', this.email)
          .get();
  
        if (!studentQuerySnapshot.empty) {
          // User is a registered student
          loader.dismiss();
          this.navController.navigateForward('/qr-scan');
          return; // Exit the function
        }
  
        // Check if the user is a registered staff member
        const staffQuerySnapshot = await this.db.collection('registered staff')
          .ref.where('email', '==', this.email).where('staffNumber', '==', this.password)
          .get();
  
        if (!staffQuerySnapshot.empty) {
          // User is a registered staff member
          loader.dismiss();
          this.navController.navigateForward('/lecture');
          return; // Exit the function
        }
  
        // User not found in either collection
        loader.dismiss();
        alert('User not found in registeredStudents or registeredStaff collections.');
      }
    } catch (error) {
      loader.dismiss();
      const errorMessage = (error as Error).message;
  
      if (errorMessage === 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)' ||
        errorMessage === 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)') {
        alert('Invalid email or password');
      } else if (errorMessage === 'Firebase: The email address is badly formatted. (auth/invalid-email)') {
        alert('Incorrectly formatted email');
      }
    }
  }
  
  
  
}
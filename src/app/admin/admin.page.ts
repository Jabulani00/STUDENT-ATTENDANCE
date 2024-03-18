import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  fullName: string = '';
  staffNumber: string = '';
  email: string = '';
  position: string = '';
  department: string = '';


  constructor(private alertController: AlertController, private loadingController: LoadingController,
    private router: Router, private auth: AngularFireAuth, private toastController: ToastController,
    private navCtrl: NavController, private firestore: AngularFirestore) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  // async submitForm() {
  //   const loader = await this.loadingController.create({
  //     message: 'Submitting...',
  //     cssClass: 'custom-loader-class',
  //   });
  //   await loader.present();

  //   try {
  //     const data = {
  //       fullName: this.fullName,
  //       staffNumber: this.staffNumber,
  //       email: this.email,
  //       position: this.position,
  //       department: this.department,
  //     };

  //     await this.afs.collection('lecturer').add(data);

  //     // Clear the input fields
  //     this.fullName = '';
  //     this.staffNumber = '';
  //     this.email = '';
  //     this.position = '';
  //     this.department = '';

  //     loader.dismiss();
  //     alert('Information successfully saved');
  //   } catch (error) {
  //     loader.dismiss();
  //     console.error('Error saving data:', error);
  //     alert('An error occurred while saving the information.');
  //   }
  // }

  async submitForm(){

    const loader = await this.loadingController.create({
      message: 'Signing up',
      cssClass: 'custom-loader-class'
    });
    await loader.present();



    this.auth.createUserWithEmailAndPassword(this.email, this.staffNumber)
      .then(userCredential => {
         this.firestore.collection('registered staff').add({
          email: this.email,
          fullName: this.fullName,
          staffNumber : this.staffNumber,
          position: this.position,
          department: this.department,

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
  }
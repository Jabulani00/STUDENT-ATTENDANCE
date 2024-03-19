import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
})
export class StaffPage implements OnInit {

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

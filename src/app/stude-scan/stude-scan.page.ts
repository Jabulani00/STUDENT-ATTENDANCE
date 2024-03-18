import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-stude-scan',
  templateUrl: './stude-scan.page.html',
  styleUrls: ['./stude-scan.page.scss'],
})
export class StudeScanPage implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  ngOnInit() {}

  async scanBarcode() {
    try {
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        console.log('Scanned data:', result.content);

        // Get the currently logged-in user
        const user = await this.auth.currentUser;

        if (user) {
          // Use the user's email as the ID
          const userId: string = user.email || ''; // Provide a default value if email is null

          // Fetch additional details from the "registeredStudents" collection
          const studentRef: AngularFirestoreDocument<any> = this.firestore.collection('registeredStudents').doc(userId)!;

          // Ensure studentRef is not undefined before calling get()
          if (studentRef) {
            const studentDetails = await studentRef.get().pipe(first()).toPromise();

            if (studentDetails && studentDetails.exists) {
              // Combine scanned data and additional details
              const attendanceDetails = {
                email: user.email,
                studentNumber: studentDetails.data().studentNumber,
                name: studentDetails.data().name,
                surname: studentDetails.data().surname,
                scanDate: new Date(), // Include the date the QR code was scanned
              };

              // Store attendance in the Firestore "Attendance" collection
              await this.firestore.collection('Attendance').doc(userId).set(attendanceDetails);
              console.log('Attendance stored successfully.');
            } else {
              console.error('Student details not found in registeredStudents collection.');
            }
          } else {
            console.error('Student reference is undefined.');
          }
        } else {
          console.error('User not logged in.');
        }
      } else {
        console.error('No barcode data found.');
      }
    } catch (error) {
      console.error('Barcode scanning error:', error);
    }
  }
}
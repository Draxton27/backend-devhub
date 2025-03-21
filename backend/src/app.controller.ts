/* eslint-disable */
import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';

@Controller()
export class AppController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get('test-firestore')
  async testFirestore() {
    const db = this.firebaseService.getFirestore();
    const docRef = db.collection('test').doc('sampleDoc');
    await docRef.set({ message: 'Firestore funcionando 🚀' });

    const doc = await docRef.get();
    return doc.data();
  }
}
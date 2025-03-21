/* eslint-disable */
import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: () => {
        if(!admin.apps.length){
        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })}
        return admin.app();
      },
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_APP', FirebaseService],
})
export class FirebaseModule {}

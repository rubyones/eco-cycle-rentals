'use client';
import {
  Auth, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';
import { doc, setDoc } from 'firebase/firestore';
import { getSdks } from '.';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
    console.error("Anonymous Sign-In Error:", error);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, extraData?: { [key: string]: any }): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      const { firestore } = getSdks(authInstance.app);
      const user = userCredential.user;
      
      // Create renter document in Firestore
      const renterRef = doc(firestore, 'renters', user.uid);
      const renterData = {
        id: user.uid,
        email: user.email,
        dateJoined: new Date().toISOString(),
        status: 'active',
        ...extraData,
      };
      
      // Update profile and set document non-blockingly
      updateProfile(user, { displayName: `${extraData?.firstName} ${extraData?.lastName}` });
      setDoc(renterRef, renterData, { merge: true }).catch(error => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: renterRef.path,
            operation: 'create',
            requestResourceData: renterData,
         }));
      });

    })
    .catch(error => {
        console.error("Email Sign-Up Error:", error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password)
  .catch(error => {
      console.error("Email Sign-In Error:", error);
  });
}

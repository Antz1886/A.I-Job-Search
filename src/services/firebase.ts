import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
  Auth
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  Firestore
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { CandidateProfile, JobOpportunity, SavedSearch } from "../types";

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
// Use firestoreDatabaseId if configured
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export interface UserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

// Auth Helper Functions
export async function signUpWithEmail(email: string, pass: string, name: string): Promise<User> {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && userCred.user) {
    await updateProfile(userCred.user, { displayName: name });
  }
  // Initialize user record in Firestore
  await initializeUserData(userCred.user.uid, {
    email: userCred.user.email,
    displayName: name || userCred.user.displayName,
    createdAt: new Date().toISOString()
  });
  return userCred.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function loginWithGoogle(): Promise<User> {
  const userCred = await signInWithPopup(auth, googleProvider);
  // Ensure user record in Firestore
  await initializeUserData(userCred.user.uid, {
    email: userCred.user.email,
    displayName: userCred.user.displayName,
    photoURL: userCred.user.photoURL,
    createdAt: new Date().toISOString()
  });
  return userCred.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// Firestore Database Sync Helpers
export async function initializeUserData(
  userId: string,
  initialData: { email: string | null; displayName: string | null; photoURL?: string | null; createdAt?: string }
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        ...initialData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore initializeUserData warning:", err);
  }
}

export async function saveUserProfileToCloud(
  userId: string,
  candidateProfile: CandidateProfile,
  extra?: { activePresetId?: string }
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      candidateProfile,
      activePresetId: extra?.activePresetId || "custom",
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Error saving profile to Firestore:", err);
  }
}

export async function loadUserProfileFromCloud(userId: string): Promise<CandidateProfile | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.candidateProfile) {
        return data.candidateProfile as CandidateProfile;
      }
    }
    return null;
  } catch (err) {
    console.warn("Error loading profile from Firestore:", err);
    return null;
  }
}

export async function saveJobToCloud(userId: string, job: JobOpportunity, status = "interested", notes = ""): Promise<void> {
  try {
    const jobDocRef = doc(db, "users", userId, "savedJobs", job.id);
    await setDoc(jobDocRef, {
      id: job.id,
      job,
      status,
      notes,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Error saving job to Firestore:", err);
  }
}

export async function removeJobFromCloud(userId: string, jobId: string): Promise<void> {
  try {
    const jobDocRef = doc(db, "users", userId, "savedJobs", jobId);
    await deleteDoc(jobDocRef);
  } catch (err) {
    console.warn("Error deleting job from Firestore:", err);
  }
}

export async function loadSavedJobsFromCloud(userId: string): Promise<{ job: JobOpportunity; status: string; notes: string }[]> {
  try {
    const colRef = collection(db, "users", userId, "savedJobs");
    const snap = await getDocs(colRef);
    const list: { job: JobOpportunity; status: string; notes: string }[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (data?.job) {
        list.push({
          job: data.job as JobOpportunity,
          status: data.status || "interested",
          notes: data.notes || ""
        });
      }
    });
    return list;
  } catch (err) {
    console.warn("Error loading saved jobs from Firestore:", err);
    return [];
  }
}

export async function saveSearchQueryToCloud(userId: string, search: SavedSearch): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "savedSearches", search.id);
    await setDoc(docRef, search, { merge: true });
  } catch (err) {
    console.warn("Error saving search to Firestore:", err);
  }
}

export async function deleteSearchQueryFromCloud(userId: string, searchId: string): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "savedSearches", searchId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Error deleting search from Firestore:", err);
  }
}

export async function loadSavedSearchesFromCloud(userId: string): Promise<SavedSearch[]> {
  try {
    const colRef = collection(db, "users", userId, "savedSearches");
    const snap = await getDocs(colRef);
    const searches: SavedSearch[] = [];
    snap.forEach((d) => {
      searches.push(d.data() as SavedSearch);
    });
    return searches;
  } catch (err) {
    console.warn("Error loading searches from Firestore:", err);
    return [];
  }
}

export { onAuthStateChanged };

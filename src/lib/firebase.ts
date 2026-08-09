import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBeGA2b6jxV6Kg8w3ZBpSBvTvGUvJirH5A",
  authDomain: "expense-management-syste-40e34.firebaseapp.com",
  projectId: "expense-management-syste-40e34",
  storageBucket: "expense-management-syste-40e34.firebasestorage.app",
  messagingSenderId: "1048682964690",
  appId: "1:1048682964690:web:bef69c58d9dbb09a926f0b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
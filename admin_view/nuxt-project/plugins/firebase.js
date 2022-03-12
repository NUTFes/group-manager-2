// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5xmYvoQPI9T4ruBG0CYZ30lKCUU4g6VI",
  authDomain: "group-manager-2.firebaseapp.com",
  projectId: "group-manager-2",
  storageBucket: "group-manager-2.appspot.com",
  messagingSenderId: "451152545078",
  appId: "1:451152545078:web:73019a57432d4646b29f97",
};
const APP = initializeApp(firebaseConfig);
const STORAGE = getStorage(APP);

export default (context, inject) => {
  inject("firebase", APP);
  inject("storage", STORAGE);
};

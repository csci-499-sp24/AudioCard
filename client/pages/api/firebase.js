import { initializeApp } from "firebase/app";


/*leaving this file here for now, adjust to correct directory where you see fit.
update: dont think it is needed anymore because im seeing google log in
        work just fine now so remove if working*/


const firebaseConfig = {
  // your config here, saw this in documentation, should be in
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  };

const app = initializeApp(firebaseConfig);ç
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyClMDMjBnmTsGmqMcJ_E-RxN9cOUClawb8",
    authDomain: "audiocard-8b463.firebaseapp.com",
    projectId: "audiocard-8b463",
    storageBucket: "audiocard-8b463.appspot.com",
    messagingSenderId: "165995901701",
    appId: "1:165995901701:web:dda7b662492dcb36e3bd6c",
    measurementId: "G-2E2EV8KZR9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
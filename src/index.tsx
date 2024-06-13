import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { IonApp, setupIonicReact } from '@ionic/react';
import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/styles";
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

setupIonicReact();

const defaultTheme = createTheme({
  palette: {
    primary: {        // Page Background
      main: "#FEFEFE"
    },
    secondary: {
      main: "#FEFEFE"  // Block Background (Profile, etc. Buttons take on the info)
    },
    info: {
      main: "#0288D1"
    }
  },
  typography: {
    fontFamily: "Public Sans"
  }
});

// Firebase configuration for the emulation project with demo mode values
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "localhost",
  projectId: "demo-project",
  storageBucket: "localhost:9199",
  messagingSenderId: "demo-messaging-sender-id",
  appId: "demo-app-id",
  measurementId: "demo-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

const firestore = getFirestore(app);
connectFirestoreEmulator(firestore, "localhost", 8080);

const storage = getStorage(app);
connectStorageEmulator(storage, "localhost", 9199);

// Sign in user to the emulated auth service
signInWithEmailAndPassword(auth, "test@example.com", "password").catch((error) => {
  if (error.code === 'auth/user-not-found') {
    createUserWithEmailAndPassword(auth, "test@example.com", "password").catch(console.error);
  }
});

ReactDOM.render(
  <React.StrictMode>
    <IonApp className="seam">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={defaultTheme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </IonApp>
  </React.StrictMode>,
  document.getElementById("root")
);
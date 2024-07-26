import React from "react";

// import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import PageSingIn from "./components/SignIn";

initializeApp({
  apiKey: "AIzaSyCC6NZCNbDAJNhPjL5BBRjgDxv_EDgkuH4",
  authDomain: "real-time-chat-01.firebaseapp.com",
  projectId: "real-time-chat-01",
  storageBucket: "real-time-chat-01.appspot.com",
  messagingSenderId: "932483464043",
  appId: "1:932483464043:web:95ff8e6c38d37300ef2a2e",
  measurementId: "G-Z1F3FV5K4Q",
});

const auth = getAuth();
const firestore = getFirestore();

function App() {
  return (
    <>
      <div>
        <PageSingIn />
      </div>
    </>
  );
}

export default App;

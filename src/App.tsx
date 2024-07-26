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
  //...
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

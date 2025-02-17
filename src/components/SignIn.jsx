import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { signInWithRedirect } from "firebase/auth";
// import { signInWithPopup } from "firebase/auth";
import { getRedirectResult } from "firebase/auth";
import { OAuthCredential } from "firebase/auth";
import ChatRoom from "./ChatRoom";
import { useEffect } from "react";

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

const SignIn = () => {
  const signInWithGoogle = async () => {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Google Access Token.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
  };

  return (
    <>
      <div className="text-center top-1/3 justify-center flex mt-[45vh]">
        <div>
          <button
            onClick={signInWithGoogle}
            className="bg-white rounded-md py-2 px-10 text-[5vw]"
          >
            Sing in with Google
          </button>
        </div>
      </div>
    </>
  );
};

const PageSingIn = () => {
  const [user] = useAuthState(auth);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <>
      <div>{user ? <ChatRoom /> : <SignIn />}</div>
    </>
  );
};

export default PageSingIn;

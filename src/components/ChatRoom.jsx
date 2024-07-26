import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getFirestore,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

// Firebase configuration
const firebaseApp = initializeApp({
  //...
});

const auth = getAuth(firebaseApp);
const db = getFirestore();
const messagesRef = collection(db, "messages");

const SignOut = () => {
  const [user] = useAuthState(auth);

  if (!user) return null;

  return (
    <button
      className="bg-red-500 p-2 text-white rounded-xl absolute right-0 top-0 mr-5 mt-5"
      onClick={() => {
        signOut(auth);
        // console.log("click sign out");
      }}
    >
      Sign Out
    </button>
  );
};

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const [user] = useAuthState(auth);

  const myMessage = uid === user.uid;

  return (
    <div
      className="flex mb-5"
      style={{
        float: myMessage ? "right" : "left",
        alignSelf: myMessage ? "self-end" : "self-start",
      }}
    >
      {myMessage ? (
        <>
          <p className="bg-slate-300 p-2 rounded-xl rounded-tr-none mr-5">
            {text}
          </p>
          {photoURL && (
            <img src={photoURL} className="rounded-full size-10 mr-2" />
          )}
        </>
      ) : (
        <>
          {photoURL && (
            <img src={photoURL} className="rounded-full size-10 ml-2" />
          )}
          <p className="bg-slate-300 p-2 rounded-xl rounded-tl-none ml-5">
            {text}
          </p>
        </>
      )}
    </div>
  );
};

const ChatRoom = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const loadedMessageIds = useRef(new Set());

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Load all messages initially
  const loadAllMessages = async () => {
    const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(messagesQuery);
    const allMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(allMessages);
    loadedMessageIds.current = new Set(snapshot.docs.map((doc) => doc.id));
    setLoading(false);

    // Scroll to the bottom when loading all messages
    scrollToBottom();
  };

  useEffect(() => {
    loadAllMessages();
  }, []);

  // Real-time listener for new messages
  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (
          change.type === "added" &&
          !loadedMessageIds.current.has(change.doc.id)
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: change.doc.id, ...change.doc.data() },
          ]);
          loadedMessageIds.current.add(change.doc.id);
          scrollToBottom();
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const [formValue, setFormValue] = useState("");

  if (!user) return <div>You need to sign in to access the chat room</div>;

  if (loading) {
    return <div>Loading...</div>;
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    if (!formValue.trim()) {
      console.error("Error sending message: empty message");
      return;
    }

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    scrollToBottom();
  };

  return (
    <>
      <div className="flex text-center justify-center text-white mt-8">
        {user.photoURL && (
          <img
            src={user.photoURL}
            className="rounded-full justify-center size-14"
          />
        )}
        <div className="flex justify-center items-center ml-5 text-3xl">
          {user.displayName}
        </div>
      </div>

      <SignOut />
      <div className="bg-slate-800 w-[80%] max-h-[80vh] flex flex-col justify-center p-5 ml-[10%] mt-5 rounded-xl overflow-y-scroll scrollbar-hide">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              text: message.text,
              uid: message.uid,
              photoURL: message.photoURL,
            }}
          />
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form
        onSubmit={sendMessage}
        className="flex space-x-2 max-w-md mx-auto mt-5"
      >
        <input
          className="border border-gray-300 p-2 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          value={formValue}
          placeholder="Type a message"
          autoComplete="off"
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-base hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </form>
    </>
  );
};

export default ChatRoom;

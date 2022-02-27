import { signOut } from "firebase/auth";
import React, { useState } from "react";

import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { auth, db } from "../firebase";
import TweetInput from "./TweetInput";
import styles from "./Feed.module.css";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      avater: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          avater: doc.data().avater,
          image: doc.data().image,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().userneme,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, []);
  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => (
        <p>{post.id}</p>
      ))}
    </div>
  );
};

export default Feed;

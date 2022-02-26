import React, { useState } from "react";
import { Avatar } from "@material-ui/core";

import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { signOut } from "@firebase/auth";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { async } from "@firebase/util";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "@firebase/storage";

const TweetInput = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = uploadBytesResumable(
        ref(storage, `images/${fileName}`),
        tweetImage
      );
      uploadTweetImg.on(
        "state_changed",
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await getDownloadURL(ref(storage, `images/${fileName}`)).then(
            async (url) => {
              addDoc(collection(db, "posts"), {
                avater: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: serverTimestamp(),
                username: user.displayName,
              });
            }
          );
        }
      );
    } else {
      addDoc(collection(db, "posts"), {
        avater: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: serverTimestamp(),
        username: user.displayName,
      });
    }
    setTweetImage(null);
    setTweetMsg("");
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await signOut(auth);
            }}
          />
        </div>
      </form>
    </>
  );
};

export default TweetInput;

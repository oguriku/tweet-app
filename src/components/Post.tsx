import { Avatar } from "@material-ui/core";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendIcon from "@material-ui/icons/Send";

import { selectUser } from "../features/userSlice";
import { db } from "../firebase";
import styles from "./Post.module.css";

interface PROPS {
  postId: string;
  avater: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  username: string;
  timestamp: any;
}

const Post: React.FC<PROPS> = (props) => {
  const [comment, setComment] = useState("");
  const user = useSelector(selectUser);
  const [postcomments, setPostcomments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      username: "",
      timestamp: null,
    },
  ]);
  useEffect(() => {
    const q = query(
      collection(db, "posts", props.postId, "comments"),
      orderBy("timestamp", "desc")
    );
    const unSub = onSnapshot(q, (snapshot) => {
      setPostcomments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          avatar: doc.data().avatar,
          text: doc.data().text,
          username: doc.data().username,
          timestamp: doc.data().timestamp,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, [props.postId]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addDoc(collection(db, "posts", props.postId, "comments"), {
      avatar: user.photoUrl,
      text: comment,
      timestanp: serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  };

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={props.avater} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{props.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className={styles.post_tweetImage}>
            <img src={props.image} alt="tweetImage" />
          </div>
        )}
        {postcomments.map((com) => (
          <div key={com.id} className={styles.post_comment}>
            <Avatar src={com.avatar} />

            <span className={styles.post_commentUser}>@{com.username}</span>
            <span className={styles.post_commentText}>{com.text} </span>
            <span className={styles.post_headerTime}>
              {new Date(com.timestamp?.toDate()).toLocaleString()}
            </span>
          </div>
        ))}

        {postcomments.map((com) => (
          <div key={com.id} className={styles.post_comment}>
            <Avatar src={com.avatar}/>

            <span className={styles.post_commentUser}>@{com.username}</span>
            <span className={styles.post_commentText}>{com.text}</span>
            <span className={styles.post_headerTime}>
              {new Date(com.timestamp?.toData()).toLocaleString()}
            </span>
          </div>
        ))}

        <form onSubmit={newComment}>
          <div className={styles.post_form}>
            <input
              type="text"
              className={styles.post_input}
              placeholder="Type new comment..."
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
            <button
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              type="submit"
            >
              <SendIcon className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;

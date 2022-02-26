import { signOut } from 'firebase/auth'
import React from 'react'

import { auth } from '../firebase'
import TweetInput from './TweetInput'
import styles from "./Feed.module.css"



const Feed = () => {
    return (
        <div className={styles.feed}> 
            <TweetInput/>
            <button onClick={() => signOut(auth)}>logout</button>
        </div>
    )
}

export default Feed

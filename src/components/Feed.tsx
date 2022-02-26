import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../firebase'
import TweetInput from './TweetInput'



const Feed = () => {
    return (
        <div>
            <TweetInput/>
            <button onClick={() => signOut(auth)}>logout</button>
        </div>
    )
}

export default Feed

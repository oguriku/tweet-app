import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../firebase'



const Feed = () => {
    return (
        <div>
            <button onClick={() => signOut(auth)}>logout</button>
        </div>
    )
}

export default Feed

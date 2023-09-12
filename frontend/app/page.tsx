'use client'
import React, { SyntheticEvent, useState } from 'react'
import Link from 'next/link'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'


export default function Home() {
  const clientId = process.env.GOOGLE_CLIENT_ID

  return (
    <main className='min-h-screen flex justiy-center '>
      <div className='dark:text-white/90 flex justify-center m-auto '>
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const data = await axios.post('http://localhost:8000/api/google/', {
                token: credentialResponse.credential
              }, { withCredentials: true })
              console.log(data)
            }}
            onError={(() => {
              console.log("login failed")
            })}
          />
        </GoogleOAuthProvider>
      </div>
    </main>
  )
}

{/* this is a comment */ }
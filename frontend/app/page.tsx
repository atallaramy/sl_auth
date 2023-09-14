import type { Metadata } from 'next'
import React from 'react'
import GoogleAuthProvider from '@/utils/googleAuthProvider'

export const metadata: Metadata = {
  title: 'Login with Google',
  description: 'Easily login with your Google account',
}

export default function Home() {
  const clientId = process.env.GOOGLE_CLIENT_ID

  return (
    <main className='min-h-screen flex justiy-center '>
      <div className='dark:text-white/90 flex justify-center m-auto '>
        <GoogleAuthProvider />
      </div>
    </main>
  )
}
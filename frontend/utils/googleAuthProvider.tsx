'use client'
import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { authFetch } from '@/app/interceptors/axios'
import { useAppDispatch } from '@/redux/hooks'
import { setAuth, logout } from '@/redux/authSlice'
import { useRouter } from 'next/navigation'

export default function GoogleAuthProvider() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  return (
    <main className='min-h-screen flex justiy-center '>
      <div className='dark:text-white/90 flex justify-center m-auto '>
        <GoogleOAuthProvider clientId='876992960791-6frkgju4gj3c2i2k3tfcr7j4ebfg44np.apps.googleusercontent.com'>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const { data } = await authFetch.post('google/', {
                  token: credentialResponse.credential
                }, { withCredentials: true })
                const token = data.access_token
                dispatch(setAuth(token))
                authFetch.defaults.headers.common['Authorization'] = `Bearer ${token}`
                router.push('/dashboard')
              } catch (error) {
                console.log(error);
              }
            }}
            onError={(() => {
              // logout on error?
              dispatch(logout())
              console.log("login failed")
            })}
          />
        </GoogleOAuthProvider>
      </div>
    </main>
  )
}

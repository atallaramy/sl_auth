'use client'
import React, { useEffect, useState } from 'react'
import { authFetch } from '@/app/interceptors/axios'

type Props = {}

export default function Dashboard({ }: Props) {
    const [message, setMessage] = useState('')

    useEffect(() => {
        (async () => {
            try {
                const { data } = await authFetch.get('user')
                setMessage(`Welcome ${data.first_name} ${data.last_name}`)
            } catch (e) {
                console.log("Dashboard could not retrieve user: ", e)
            }
        })()
    }, [])

    return (
        <div className='flex justify-center min-h-screen text-center'>
            <div className='m-auto p-2 border-1'>
                <div className='dark:text-white'>
                    <h1> Dashboard page</h1>
                    <h3>{message}</h3>
                </div>
            </div>
        </div>
    )
}
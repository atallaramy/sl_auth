'use client'
import Link from 'next/link'
import { useAppSelector } from "@/redux/hooks"
import { authStatus } from "@/redux/authSlice"

export default function Navbar() {
    const loginStatus = useAppSelector(authStatus)

    const content = loginStatus === true ? (
        <Link href="/logout">Logout</Link>
    ) : (
        <Link href="/login">Login</Link>
    )
    return (
        <nav className='bg-slate-600 p-4 flex justify-between flex-col md:flex-row sticky top-0 drop-shadow-xl align-middle'>
            <h1 className='text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0'>
                <Link href="/">SL Auth</Link>
            </h1>
            <div className='flex justify-between text-white'>
                {content}
            </div>
        </nav>
    )
}

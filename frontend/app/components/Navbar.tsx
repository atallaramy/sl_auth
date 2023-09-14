'use client'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { authStatus, logout } from "@/redux/authSlice"
import { authFetch } from '@/app/interceptors/axios'

export default function Navbar() {
    const loginStatus = useAppSelector(authStatus)
    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        try {
            const { data } = await authFetch.post('logout/')
            dispatch(logout())
        } catch (e) {
            console.log(e)
        }
    }

    const content = loginStatus.length > 0 ? (
        <Link href="/" onClick={handleLogout}>Logout</Link>
    ) : (
        <Link href="/">Login</Link>
    )
    return (
        <nav className='bg-slate-600 p-4 flex justify-between flex-col md:flex-row sticky top-0 drop-shadow-xl align-middle'>
            <h1 className='text-3xl font-bold text-white grid place-content-center mb-2 md:mb-0'>
                <Link href="/dashboard">SL Auth</Link>
            </h1>
            <div className='flex justify-between text-white/80 items-center hover:text-white'>
                {content}
            </div>
        </nav>
    )
}

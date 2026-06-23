'use client'

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { isValidToken } from "@/app/utils/auth";

export default function AdminLoginPage() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [form, setForm] = useState({ email: '', password: '' })

    useEffect(() => {
        if (isValidToken('adminToken', 'organization_admin')) {
            router.replace('/admin/feature-flags')
        }
    }, [router])

    const changeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev)=>({ ...prev, [name]: value }))
    }

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/admin/login`, form)
            localStorage.setItem('adminToken', response.data.token)
            enqueueSnackbar('Login successful', {variant:'success'})
            router.push('/admin/feature-flags')
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Login failed', {variant:'error'})
            }else{
                enqueueSnackbar('Login failed', {variant:'error'})
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Organization Admin Login</h1>
                    <p className="mt-2 text-sm text-slate-500">Manage feature flags for your organization.</p>
                </div>
                <form className="space-y-5" onSubmit={submitForm}>
                    <input name="email" type="email" value={form.email} onChange={changeForm} placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <input name="password" type="password" value={form.password} onChange={changeForm} placeholder="Password" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition">Login</button>
                </form>
                <p className="mt-6 text-sm text-slate-500 text-center">Need an account? <Link className="text-blue-600 font-medium" href="/admin/signup">Signup</Link></p>
            </div>
        </div>
    )
}

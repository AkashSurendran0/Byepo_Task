'use client'

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { isValidToken } from "@/app/utils/auth";

type Organization = {
    _id: string;
    name: string;
}

export default function UserSignupPage() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [form, setForm] = useState({ name: '', email: '', password: '', organizationId: '' })

    useEffect(() => {
        if (isValidToken('userToken', 'end_user')) {
            router.replace('/user/check-feature')
            return
        }

        const loadOrganizations = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/organizations`)
                setOrganizations(response.data.organizations)
            } catch {
                enqueueSnackbar('Unable to load organizations', {variant:'error'})
            }
        }
        loadOrganizations()
    }, [enqueueSnackbar, router])

    const changeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev)=>({ ...prev, [name]: value }))
    }

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/user/signup`, form)
            localStorage.setItem('userToken', response.data.token)
            enqueueSnackbar('Signup successful', {variant:'success'})
            router.push('/user/check-feature')
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Signup failed', {variant:'error'})
            }else{
                enqueueSnackbar('Signup failed', {variant:'error'})
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">End User Signup</h1>
                    <p className="mt-2 text-sm text-slate-500">Join an organization to check its enabled features.</p>
                </div>
                <form className="space-y-5" onSubmit={submitForm}>
                    <input name="name" value={form.name} onChange={changeForm} placeholder="Name" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <input name="email" type="email" value={form.email} onChange={changeForm} placeholder="Email" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <input name="password" type="password" value={form.password} onChange={changeForm} placeholder="Password" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <select name="organizationId" value={form.organizationId} onChange={changeForm} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required>
                        <option value="">Select organization</option>
                        {organizations.map((organization)=>(
                            <option key={organization._id} value={organization._id}>{organization.name}</option>
                        ))}
                    </select>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition">Create Account</button>
                </form>
                <p className="mt-6 text-sm text-slate-500 text-center">Already have an account? <Link className="text-blue-600 font-medium" href="/user/login">Login</Link></p>
            </div>
        </div>
    )
}

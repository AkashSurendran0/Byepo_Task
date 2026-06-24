'use client'

import axios from "axios";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { isValidToken } from "@/app/utils/auth";

export default function LoginPage() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [loginDetails, setLoginDetails]=useState({
        email:'',
        password:''
    })

    React.useEffect(() => {
        if (isValidToken('superAdminToken', 'super_admin')) {
            router.replace('/super_admin/organisations')
        }
    }, [router])

    const changeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value}=e.target
        setLoginDetails((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const submitForm = async () => {
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/super-admin/login`, loginDetails)
            localStorage.setItem('superAdminToken', response.data.token)
            enqueueSnackbar('Login successful', {variant:'success'})
            router.push('/super_admin/organisations')
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Something went wrong', {variant:'error'})
            }else{
                enqueueSnackbar('Something went wrong', {variant:'error'})
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                Super Admin Login
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                Manage organizations and platform settings.
                </p>
            </div>

            <form className="space-y-5">
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={loginDetails.email}
                    onChange={(e)=>changeForm(e)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                </label>
                <input
                    value={loginDetails.password}
                    name="password"
                    onChange={(e)=>changeForm(e)}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
                    required
                />
                </div>

            </form>
                <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition mt-4"
                onClick={submitForm}
                >
                Login
                </button>

            <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-400 text-center">
                Static credentials configured by the system.
                </p>
            </div>
            </div>
        </div>
    );
}

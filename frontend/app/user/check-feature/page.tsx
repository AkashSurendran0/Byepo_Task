'use client'

import axios from "axios";
import { isValidToken, logout } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

type CheckResult = {
    featureKey: string;
    enabled: boolean;
}

export default function CheckFeaturePage() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [featureKey, setFeatureKey] = useState('')
    const [result, setResult] = useState<CheckResult | null>(null)

    useEffect(() => {
        if (!isValidToken('userToken', 'end_user')) {
            router.replace('/user/login')
        }
    }, [router])

    const checkFeature = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValidToken('userToken', 'end_user')) {
            router.replace('/user/login')
            return
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/user/check-feature`, { featureKey }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
            })
            setResult(response.data)
        } catch (error) {
            setResult(null)
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to check feature', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to check feature', {variant:'error'})
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Check Feature</h1>
                            <p className="mt-2 text-sm text-slate-500">Submit a feature key to check your organization&apos;s access.</p>
                        </div>
                        <button
                            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                            onClick={()=>logout('userToken', '/user/login')}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <form className="space-y-5" onSubmit={checkFeature}>
                    <input value={featureKey} onChange={(e)=>setFeatureKey(e.target.value)} placeholder="feature_key" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition">Check Feature</button>
                </form>
                {result && (
                    <div className={result.enabled ? "mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" : "mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"}>
                        <p className="text-sm text-slate-500">Feature key</p>
                        <p className="font-semibold text-slate-900">{result.featureKey}</p>
                        <p className={result.enabled ? "mt-3 text-lg font-bold text-emerald-600" : "mt-3 text-lg font-bold text-slate-600"}>{result.enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

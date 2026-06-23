'use client'

import axios from "axios";
import { isValidToken, logout } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

type FeatureFlag = {
    _id: string;
    featureKey: string;
    enabled: boolean;
    createdAt: string;
}

export default function FeatureFlagsPage() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [flags, setFlags] = useState<FeatureFlag[]>([])
    const [featureKey, setFeatureKey] = useState('')
    const [enabled, setEnabled] = useState(false)
    const [loading, setLoading] = useState(true)

    const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` })

    const loadFlags = async () => {
        if (!isValidToken('adminToken', 'organization_admin')) {
            router.replace('/admin/login')
            return
        }

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/admin/feature-flags`, { headers: authHeaders() })
            setFlags(response.data.flags)
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to load feature flags', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to load feature flags', {variant:'error'})
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isValidToken('adminToken', 'organization_admin')) {
            router.replace('/admin/login')
            return
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFlags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const createFlag = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/admin/feature-flags`, { featureKey, enabled }, { headers: authHeaders() })
            setFeatureKey('')
            setEnabled(false)
            enqueueSnackbar('Feature flag created', {variant:'success'})
            loadFlags()
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to create feature flag', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to create feature flag', {variant:'error'})
            }
        }
    }

    const updateFlag = async (flag: FeatureFlag, nextEnabled: boolean) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/admin/feature-flags/${flag._id}`, { enabled: nextEnabled }, { headers: authHeaders() })
            setFlags((prev)=>prev.map((item)=>item._id === flag._id ? { ...item, enabled: nextEnabled } : item))
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to update feature flag', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to update feature flag', {variant:'error'})
            }
        }
    }

    const deleteFlag = async (id: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/admin/feature-flags/${id}`, { headers: authHeaders() })
            setFlags((prev)=>prev.filter((flag)=>flag._id !== id))
            enqueueSnackbar('Feature flag deleted', {variant:'success'})
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to delete feature flag', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to delete feature flag', {variant:'error'})
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Feature Flags</h1>
                        <p className="mt-2 text-sm text-slate-500">Create and manage flags scoped to your organization.</p>
                    </div>
                    <button
                        className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition"
                        onClick={()=>logout('adminToken', '/admin/login')}
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={createFlag} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <input value={featureKey} onChange={(e)=>setFeatureKey(e.target.value)} placeholder="feature_key" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black" required />
                    <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={enabled} onChange={(e)=>setEnabled(e.target.checked)} className="h-5 w-5 accent-blue-600" />
                        Enabled
                    </label>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition">Create Flag</button>
                </form>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-4 px-6 py-4 bg-slate-100 text-sm font-semibold text-slate-700">
                        <span>Feature Key</span>
                        <span>Status</span>
                        <span>Created Date</span>
                        <span>Actions</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {loading && <div className="px-6 py-5 text-slate-500">Loading feature flags...</div>}
                        {!loading && flags.length === 0 && <div className="px-6 py-5 text-slate-500">No feature flags found.</div>}
                        {flags.map((flag)=>(
                            <div key={flag._id} className="grid grid-cols-4 px-6 py-5 hover:bg-slate-50 transition items-center">
                                <span className="font-medium text-slate-900">{flag.featureKey}</span>
                                <span className={flag.enabled ? 'text-emerald-600 font-medium' : 'text-slate-500'}>{flag.enabled ? 'Enabled' : 'Disabled'}</span>
                                <span className="text-slate-500">{new Date(flag.createdAt).toLocaleDateString()}</span>
                                <span className="flex gap-3">
                                    <button onClick={()=>updateFlag(flag, !flag.enabled)} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition">{flag.enabled ? 'Disable' : 'Enable'}</button>
                                    <button onClick={()=>deleteFlag(flag._id)} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

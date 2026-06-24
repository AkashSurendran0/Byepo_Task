'use client'

import axios from "axios";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isValidToken, logout } from "@/app/utils/auth";

type Organization = {
    _id: string;
    name: string;
    createdAt: string;
    adminCount: number;
}

export default function OrganizationsPage() {
    const router = useRouter()
    const [openModal, setOpenModal]=useState(false)
    const [organizations, setOrganizations]=useState<Organization[]>([])
    const [name, setName]=useState('')
    const [search, setSearch]=useState('')
    const [loading, setLoading]=useState(true)
    const { enqueueSnackbar } = useSnackbar()

    const fetchOrganizations = async () => {
        if (!isValidToken('superAdminToken', 'super_admin')) {
            router.replace('/super_admin/login')
            return
        }

        try {
            const token = localStorage.getItem('superAdminToken')
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/super-admin/organizations`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrganizations(response.data.organizations)
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to load organizations', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to load organizations', {variant:'error'})
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isValidToken('superAdminToken', 'super_admin')) {
            router.replace('/super_admin/login')
            return
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrganizations()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const filteredOrganizations = useMemo(() => {
        return organizations.filter((organization) =>
            organization.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [organizations, search])

    const createOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('superAdminToken')
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/super-admin/organizations`, { name }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            enqueueSnackbar('Organization created', {variant:'success'})
            setName('')
            setOpenModal(false)
            fetchOrganizations()
        } catch (error) {
            if(axios.isAxiosError(error)){
                enqueueSnackbar(error.response?.data?.message || 'Unable to create organization', {variant:'error'})
            }else{
                enqueueSnackbar('Unable to create organization', {variant:'error'})
            }
        }
    }

    return (
        <>
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
                    {/* Modal */}
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        {/* Header */}
                        <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Create Organization
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Add a new organization to the platform.
                        </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={createOrganization}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                            Organization Name
                            </label>

                            <input
                            type="text"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="Enter organization name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
                            required
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                            type="button"
                            onClick={()=>setOpenModal(false)}
                            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                            >
                            Cancel
                            </button>

                            <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                            Create Organization
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Organizations
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Manage tenant organizations.
                    </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
                        onClick={()=>setOpenModal(prev => !prev)}
                        >
                        Add Organization
                        </button>
                        <button
                        className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-white transition"
                        onClick={()=>logout('superAdminToken', '/super_admin/login')}
                        >
                        Logout
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
                    <input
                    type="text"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search organizations..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-black"
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 px-6 py-4 bg-slate-100 text-sm font-semibold text-slate-700">
                    <span>Organization Name</span>
                    <span>Created Date</span>
                    <span>Admin Count</span>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-200">
                    {loading && (
                        <div className="px-6 py-5 text-slate-500">Loading organizations...</div>
                    )}
                    {!loading && filteredOrganizations.length === 0 && (
                        <div className="px-6 py-5 text-slate-500">No organizations found.</div>
                    )}
                    {filteredOrganizations.map((organization)=>(
                        <div key={organization._id} className="grid grid-cols-3 px-6 py-5 hover:bg-slate-50 transition">
                            <span className="font-medium text-slate-900">{organization.name}</span>
                            <span className="text-slate-500">{new Date(organization.createdAt).toLocaleDateString()}</span>
                            <span className="text-slate-500">{organization.adminCount}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

'use client'

import { useState } from "react";

export default function OrganizationsPage() {
    const [openModal, setOpenModal]=useState(false)

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
                        <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                            Organization Name
                            </label>

                            <input
                            type="text"
                            placeholder="Enter organization name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                            type="button"
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

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
                    onClick={()=>setOpenModal(prev => !prev)}
                    >
                    Add Organization
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
                    <input
                    type="text"
                    placeholder="Search organizations..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    <div className="grid grid-cols-3 px-6 py-5 hover:bg-slate-50 transition">
                        <span className="font-medium text-slate-900">Netflix</span>
                        <span className="text-slate-500">23 Jun 2026</span>
                        <span className="text-slate-500">2</span>
                    </div>

                    <div className="grid grid-cols-3 px-6 py-5 hover:bg-slate-50 transition">
                        <span className="font-medium text-slate-900">Amazon</span>
                        <span className="text-slate-500">22 Jun 2026</span>
                        <span className="text-slate-500">1</span>
                    </div>

                    <div className="grid grid-cols-3 px-6 py-5 hover:bg-slate-50 transition">
                        <span className="font-medium text-slate-900">Swiggy</span>
                        <span className="text-slate-500">20 Jun 2026</span>
                        <span className="text-slate-500">3</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

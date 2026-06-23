import Link from "next/link";

const links = [
  { href: "/super_admin/login", title: "Super Admin", description: "Create and view organizations." },
  { href: "/admin/login", title: "Organization Admin", description: "Manage feature flags for your organization." },
  { href: "/user/login", title: "End User", description: "Check whether a feature is enabled." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <main className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Feature Flag Management</h1>
          <p className="mt-2 text-sm text-slate-500">Choose the application area for your role.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {links.map((link)=>(
            <Link key={link.href} href={link.href} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 hover:border-blue-200 hover:shadow-md transition">
              <h2 className="text-xl font-bold text-slate-900">{link.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{link.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

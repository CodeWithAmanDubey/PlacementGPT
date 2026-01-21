"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          {user?.imageUrl && (
            <Image 
              src={user.imageUrl} 
              alt="Profile" 
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-indigo-500/20"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-neutral-400">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">College / University</label>
              <input 
                type="text" 
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your college name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Branch</label>
              <input 
                type="text" 
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">CGPA</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 8.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Target Role</label>
              <select className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white">
                <option value="sde">Software Development Engineer</option>
                <option value="data">Data Scientist</option>
                <option value="pm">Product Manager</option>
                <option value="analyst">Data Analyst</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

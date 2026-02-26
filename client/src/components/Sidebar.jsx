import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  PenLine,
  Hash,
  Image,
  Eraser,
  Scissors,
  FileText,
  LogOut,
  Users,
} from 'lucide-react'
import { useUser, useClerk, Protect } from '@clerk/clerk-react'

const Sidebar = ({ sidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between
      max-sm:absolute top-14 bottom-0 z-40
      ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}
      transition-all duration-300 ease-in-out`}
    >
      {/* Top Section */}
      <div className="p-5 space-y-2">
        {user && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.imageUrl}
              alt="user"
              className="w-16 h-16 rounded-full object-cover"
            />
            <p className="mt-2 font-medium text-gray-800">
              {user.firstName || user.fullName}
            </p>
          </div>
        )}

        <SidebarItem to="/ai" icon={<Home size={18} />} text="Dashboard" />
        <SidebarItem to="/ai/write-article" icon={<PenLine size={18} />} text="Write Article" />
        <SidebarItem to="/ai/blog-titles" icon={<Hash size={18} />} text="Blog Titles" />
        <SidebarItem to="/ai/generate-images" icon={<Image size={18} />} text="Generate Images" />
        <SidebarItem to="/ai/remove-background" icon={<Eraser size={18} />} text="Remove Background" />
        <SidebarItem to="/ai/remove-object" icon={<Scissors size={18} />} text="Remove Object" />
        <SidebarItem to="/ai/review-resume" icon={<FileText size={18} />} text="Review Resume" />
        <SidebarItem to="/ai/community" icon={<Users size={18} />} text="Community" />
      </div>

      {/* Bottom Profile + Logout */}
      {user && (
        <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between">
          <div
            onClick={() =>
              openUserProfile({ appearance: { elements: { card: 'rounded-xl' } } })
            }
            className="flex gap-2 items-center cursor-pointer"
          >
            <img
              src={user.imageUrl}
              className="w-8 h-8 rounded-full object-cover"
              alt="user"
            />
            <div>
              <h1 className="text-sm font-medium text-gray-800">
                {user.fullName}
              </h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </p>
            </div>
          </div>

          <LogOut
            onClick={signOut}
            className="w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

const SidebarItem = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      end={to === '/ai'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
        ${
          isActive
            ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md'
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
        }`
      }
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </NavLink>
  )
}

export default Sidebar
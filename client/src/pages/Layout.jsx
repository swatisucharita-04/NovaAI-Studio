import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { X, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between px-4 py-3 border-b bg-white">
        <img
          src={assets.logo}
          alt="logo"
          className="h-9 cursor-pointer"
          onClick={() => navigate('/')}
        />

        {sidebar ? (
          <X
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            onClick={() => setSidebar(false)}
          />
        ) : (
          <Menu
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
            onClick={() => setSidebar(true)}
          />
        )}
      </nav>

      {/* Main Layout */}
      <div className="flex w-full h-[calc(100vh-56px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className="flex-1 bg-[#F4F7FB] overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
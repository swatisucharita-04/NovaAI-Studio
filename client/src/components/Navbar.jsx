import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <div className="fixed z-50 w-full bg-white/80 backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <img
        src={assets.logo}
        alt="NovaAI Studio"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2.5"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar
// src/components/Plan.jsx
import React from 'react'
import { Check } from 'lucide-react'

const Plans = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Choose Your Plan
      </h1>
      <p className="text-gray-500 mb-10 text-center max-w-xl">
        Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="text-3xl font-bold mt-2">$0</p>
          <p className="text-sm text-gray-500 mb-6">Always free</p>

          <ul className="space-y-3 flex-1">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Title Generation
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Article Generation
            </li>
          </ul>

          <button className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
            Switch to this plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col relative">
          <span className="absolute top-4 right-4 text-xs bg-black text-white px-2 py-1 rounded-full">
            Active
          </span>

          <h2 className="text-lg font-semibold">Premium</h2>
          <p className="text-3xl font-bold mt-2">
            $16 <span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">Only billed monthly</p>

          <ul className="space-y-3 flex-1">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Title Generation
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Article Generation
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Generate Images
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Remove Background
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Remove Object
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" /> Resume Review
            </li>
          </ul>

          <button className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Current Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Plans
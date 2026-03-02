import React, { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'
import { getPublishedCreations, toggleLikeCreation } from '../api.js'

const Community = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)

  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const token = await getToken()
      const response = await getPublishedCreations(token)
      if (response.data.success) {
        setCreations(response.data.creations ?? [])
      }
    } catch (error) {
      toast.error('Failed to load community creations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreations()
  }, [])

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken()
      const response = await toggleLikeCreation(id, token)
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchCreations() // refetch to get updated likes count
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Creations
      </h2>

      {creations.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 text-sm mt-20">
          <p>No community creations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation) => (
            <div
              key={creation.id}
              onClick={() => setActiveId(activeId === creation.id ? null : creation.id)}
              className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer group"
            >
              {/* Image */}
              <img
                src={creation.content}
                alt="creation"
                className="w-full h-64 object-cover"
              />

              {/* Likes */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                <Heart
                  onClick={(e) => {
                    e.stopPropagation()
                    imageLikeToggle(creation.id)
                  }}
                  className="w-4 h-4 cursor-pointer hover:text-red-400 transition"
                />
                {creation.likes ?? 0}
              </div>

              {/* Prompt Overlay (Only on Click) */}
              {activeId === creation.id && (
                <div className="absolute inset-0 bg-black/60 flex items-end p-3 transition">
                  <p className="text-white text-sm leading-snug">
                    {creation.prompt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Community
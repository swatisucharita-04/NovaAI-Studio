import React, { useState } from 'react'
import { Heart } from 'lucide-react'

import img1 from '../assets/ai_gen_img_1.png'
import img2 from '../assets/ai_gen_img_2.png'
import img3 from '../assets/ai_gen_img_3.png'

const creations = [
  {
    id: 1,
    image: img1,
    prompt: 'Generate an image of a Boy is on Boat, and fishing in the style Anime style.',
    likes: 2,
  },
  {
    id: 2,
    image: img2,
    prompt: 'A boy riding a bicycle on a sunny street in anime style.',
    likes: 2,
  },
  {
    id: 3,
    image: img3,
    prompt: 'A child driving a toy car in the sky with clouds.',
    likes: 1,
  },
]

const Community = () => {
  const [activeId, setActiveId] = useState(null)

  const handleToggle = (id) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Creations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creations.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer group"
          >
            {/* Image */}
            <img
              src={item.image}
              alt="creation"
              className="w-full h-64 object-cover"
            />

            {/* Likes */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
              <Heart className="w-4 h-4" />
              {item.likes}
            </div>

            {/* Prompt Overlay (Only on Click) */}
            {activeId === item.id && (
              <div className="absolute inset-0 bg-black/60 flex items-end p-3 transition">
                <p className="text-white text-sm leading-snug">
                  {item.prompt}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
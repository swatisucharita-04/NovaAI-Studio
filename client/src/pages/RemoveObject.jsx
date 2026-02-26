import React, { useState } from 'react'
import { Scissors, Image as ImageIcon, Sparkles } from 'lucide-react'

const RemoveObject = () => {
  const [file, setFile] = useState(null)
  const [objectName, setObjectName] = useState('')
  const [resultImage, setResultImage] = useState(null)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    // Dummy preview for now
    setResultImage('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT CARD */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 text-indigo-500" />
            <h2 className="font-semibold text-gray-800">
              Object Removal
            </h2>
          </div>

          {/* Upload */}
          <label className="text-sm font-medium text-gray-700">
            Upload image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
          />

          {/* Object name */}
          <label className="mt-4 block text-sm font-medium text-gray-700">
            Describe object name to remove
          </label>
          <input
            type="text"
            value={objectName}
            onChange={(e) => setObjectName(e.target.value)}
            placeholder="e.g. watch or spoon, Only single object name"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Button */}
          <button
            type="submit"
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Scissors className="w-4" />
            Remove object
          </button>
        </form>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
          {!resultImage ? (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Scissors className="w-10 h-10 mb-2 opacity-40" />
              Upload an image and click “Remove Object” to get started
            </div>
          ) : (
            <img
              src={resultImage}
              alt="Processed"
              className="rounded-lg max-h-87.5 object-contain"
            />
          )}
        </div>

      </div>
    </div>
  )
}

export default RemoveObject
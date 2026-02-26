import React, { useState } from "react"
import { Eraser, Sparkles } from "lucide-react"

const RemoveBackground = () => {
  const [file, setFile] = useState(null)
  const [resultImage, setResultImage] = useState(null)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    // Dummy preview for now
    setResultImage("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee")
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT CARD */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-800">
              Background Removal
            </h2>
          </div>

          <label className="text-sm font-medium text-gray-700">
            Upload image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          />

          <p className="mt-1 text-xs text-gray-400">
            Supports JPG, PNG, and other image formats
          </p>

          <button
            type="submit"
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-orange-400 to-orange-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Eraser className="w-4" />
            Remove background
          </button>
</form>

{/* RIGHT CARD */}
<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center gap-2 mb-4">
    <Eraser className="w-5 text-orange-500" />
    <h2 className="font-semibold text-gray-800">
      Processed Image
    </h2>
  </div>

  {/* Content */}
  <div className="flex items-center justify-center min-h-55">
    {!resultImage ? (
      <div className="flex flex-col items-center text-gray-400 text-sm text-center">
        <Eraser className="w-10 h-10 mb-2 opacity-40" />
        Upload an image and click “Remove Background” to get started
      </div>
    ) : (
      <img
        src={resultImage}
        alt="Processed"
        className="rounded-lg max-h-75 object-contain"
      />
    )}
        </div>
      </div>
    </div>
  </div>
)
}

export default RemoveBackground
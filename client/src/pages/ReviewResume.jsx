import React, { useState } from 'react'
import { Sparkles, FileText } from 'lucide-react'

const ReviewResume = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)

  const onSubmitHandler = (e) => {
    e.preventDefault()
    // Dummy result (replace with API later)
    setResult('Your resume looks good! Consider improving bullet points and adding metrics.')
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT CARD */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 text-emerald-500" />
            <h2 className="font-semibold text-gray-800">
              Resume Review
            </h2>
          </div>

          {/* Upload */}
          <label className="text-sm font-medium text-gray-700">
            Upload Resume
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2 w-full text-sm border border-gray-300 rounded-lg p-2 cursor-pointer bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            Supports PDF resume only.
          </p>

          {/* Button */}
          <button
            type="submit"
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <FileText className="w-4" />
            Review Resume
          </button>
        </form>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 text-emerald-500" />
            <h2 className="font-semibold text-gray-800">
              Analysis Results
            </h2>
          </div>

          {/* Content */}
          <div className="flex flex-1 items-center justify-center">
            {!result ? (
              <div className="flex flex-col items-center text-gray-400 text-sm text-center">
                <FileText className="w-10 h-10 mb-2 opacity-40" />
                Upload a resume and click “Review Resume” to get started
              </div>
            ) : (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReviewResume
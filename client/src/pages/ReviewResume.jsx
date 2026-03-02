import React, { useState } from 'react'
import { Sparkles, FileText, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import { reviewResume } from '../api.js'
import ReactMarkdown from 'react-markdown'

const ReviewResume = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please upload a resume first')
      return
    }

    setLoading(true)
    try {
      const token = await getToken()

      const formData = new FormData()
      formData.append('resume', file)

      const response = await reviewResume(formData, token)

      if (response.data.success) {
        setResult(response.data.content)
      } else {
        toast.error(response.data.message || 'Failed to review resume')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to review resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-[#F7F9FC]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT CARD */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
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
            Supports PDF resume only. Max size: 5MB.
          </p>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 animate-spin" />
            ) : (
              <FileText className="w-4" />
            )}
            {loading ? 'Reviewing...' : 'Review Resume'}
          </button>
        </form>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 text-emerald-500" />
            <h2 className="font-semibold text-gray-800">
              Analysis Results
            </h2>
          </div>

          {/* Content */}
          <div className="flex flex-1 items-center justify-center min-h-55">
            {!result ? (
              <div className="flex flex-col items-center text-gray-400 text-sm text-center">
                <FileText className="w-10 h-10 mb-2 opacity-40" />
                Upload a resume and click "Review Resume" to get started
              </div>
            ) : (
              <div className="text-sm text-gray-700 overflow-y-auto max-h-96 w-full prose prose-sm max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ReviewResume
import React, { useState } from 'react'
import { Image, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@clerk/clerk-react'
import { generateImage } from '../api.js'

const stylesList = [
  'Realistic',
  'Ghibli style',
  'Anime style',
  'Cartoon style',
  'Fantasy style',
  'Realistic style',
  '3D style',
  'Portrait style',
]

const GenerateImages = () => {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Fantasy style')
  const [content, setContent] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setLoading(true)
    try {
      const token = await getToken()
      const fullPrompt = `Generate an image of ${prompt.trim()} in ${style}`
      const response = await generateImage({ prompt: fullPrompt, publish }, token)
      if (response.data.success) {
        setContent(response.data.content)
      } else {
        toast.error(response.data.message || 'Failed to generate image')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to generate image')
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
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 text-green-600" />
            <h2 className="font-semibold text-gray-800">
              AI Image Generator
            </h2>
          </div>

          {/* Prompt */}
          <label className="text-sm font-medium text-gray-700">
            Describe Your Image
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe what you want to see in the image.."
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

          {/* Styles */}
          <p className="mt-4 text-sm font-medium text-gray-700">
            Style
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {stylesList.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`px-4 py-1 rounded-full text-xs border transition ${
                  style === s
                    ? 'bg-green-50 text-green-600 border-green-400'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Publish Toggle */}
          <div className="my-6 flex items-center gap-2">
            <label className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition" />
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4" />
            </label>
            <p className="text-sm">Make this image Public</p>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-2 rounded-lg bg-linear-to-r from-green-600 to-green-400 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 animate-spin" />
            ) : (
              <Image className="w-4" />
            )}
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
          {!content ? (
            <div className="flex flex-col items-center text-gray-400 text-sm">
              <Image className="w-10 h-10 mb-2 opacity-40" />
              Describe an image and click “Generate Image” to get started
            </div>
          ) : (
            <img
              src={content}
              alt="Generated"
              className="rounded-lg max-h-87.5 object-contain"
            />
          )}
        </div>

      </div>
    </div>
  )
}

export default GenerateImages
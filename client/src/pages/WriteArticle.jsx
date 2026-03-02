import React, { useState } from 'react'
import { Sparkles, PenLine, Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import { generateArticle } from '../api.js'

const WriteArticle = () => {
  const [topic, setTopic] = useState('')
  const [length, setLength] = useState('short')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { getToken } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError('Please enter a topic.')
      return
    }
    setError('')
    setContent('')
    setLoading(true)
    try {
      const token = await getToken()
      const lengthHint = length === 'short' ? '500–800 words' : length === 'medium' ? '800–1200 words' : '1200+ words'
      const prompt = `Write an article about: ${topic.trim()}. Length: ${lengthHint}.`
      const response = await generateArticle(prompt, token)
      setContent(response.data.content || '')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate article.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-scroll p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card */}
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Article Configuration
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Article Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="The future of artificial intelligence is..."
              className="mt-2 w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Article Length
            </label>

            <div className="flex flex-wrap gap-3 mt-2">
              {['short', 'medium', 'long'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLength(opt)}
                  disabled={loading}
                  className={`px-4 py-1 rounded-full text-xs border transition ${
                    length === opt
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {opt === 'short' && 'Short (500–800 words)'}
                  {opt === 'medium' && 'Medium (800–1200 words)'}
                  {opt === 'long' && 'Long (1200+ words)'}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <PenLine size={16} />}
            {loading ? 'Generating...' : 'Generate article'}
          </button>
        </form>

        {/* Right Card */}
        <div className="w-full bg-white rounded-xl border border-gray-200 p-6 flex flex-col min-h-50">
          {content ? (
            <div className="flex-1 overflow-y-auto text-left">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Generated article</h3>
              <div className="text-sm text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none">
                <div className=".reset-tw">
                  <Markdown>{content}</Markdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
              <PenLine size={36} />
              <p className="mt-3 text-sm">
                Enter a topic and click "Generate article" to get started. Results are saved to your database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WriteArticle
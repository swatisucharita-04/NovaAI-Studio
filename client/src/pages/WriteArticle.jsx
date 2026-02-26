import React, { useState } from 'react'
import { Sparkles, PenLine } from 'lucide-react'

const WriteArticle = () => {
  const [topic, setTopic] = useState('')
  const [length, setLength] = useState('short')

  return (
    <div className="h-full overflow-y-scroll p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card */}
        <form className="w-full bg-white rounded-xl border border-gray-200 p-6 space-y-4">
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

          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition"
          >
            <PenLine size={16} />
            Generate article
          </button>
        </form>

        {/* Right Card */}
        <div className="w-full bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center text-gray-400">
          <PenLine size={36} />
          <p className="mt-3 text-sm">
            Enter a topic and click “Generate article” to get started
          </p>
        </div>
      </div>
    </div>
  )
}

export default WriteArticle
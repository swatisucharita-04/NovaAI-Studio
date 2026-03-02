import React, { useState } from 'react'
import { Hash, Sparkles, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import { generateBlockTitle } from '../api.js'

const BlogTitles = () => {
  const { getToken } = useAuth()
  const categories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food',
  ]

  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setLoading(true)
    try {
      // strict prompt with explicit markdown format
      const prompt = `
Generate blog titles for the keyword "${keyword.trim()}" in the category "${selectedCategory}".

Return strictly in this exact markdown format:

## Beginner-Friendly
- Title 1
- Title 2
- Title 3

## Intermediate
- Title 1
- Title 2
- Title 3

## Advanced
- Title 1
- Title 2
- Title 3

Do not add any explanation. Only return markdown exactly like above.
`;
      const token = await getToken()
      const response = await generateBlockTitle(prompt, token)
      console.log('block title raw response', response.data);
      if (response.data.success) {
        const result = response.data.content || '';
        setContent(result);
        toast.success('Title generated successfully!')
      } else {
        toast.error(response.data.message || 'Failed to generate title')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to generate title')
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
            <Sparkles className="w-5 text-purple-600" />
            <h2 className="font-semibold text-gray-800">
              AI Title Generator
            </h2>
          </div>

          {/* Keyword */}
          <label className="text-sm font-medium text-gray-700">
            Keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="The future of artificial intelligence"
            disabled={loading}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />

          {/* Category */}
          <p className="mt-4 text-sm font-medium text-gray-700">
            Category
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 rounded-full text-xs border transition ${
                  selectedCategory === cat
                    ? 'bg-blue-50 text-blue-600 border-blue-400'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-fuchsia-500 to-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 animate-spin" />
            ) : (
              <Hash className="w-4" />
            )}
            {loading ? 'Generating...' : 'Generate title'}
          </button>
        </form>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 text-purple-600" />
            <h2 className="font-semibold text-gray-800">
              Generated titles
            </h2>
          </div>

          {!content ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
              <Hash className="w-10 h-10 mb-2 opacity-40" />
              Enter keywords and click "Generate Title" to get started
            </div>
          ) : (
            <div className="mt-4 p-3 text-sm text-slate-600 text-left prose prose-sm .reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default BlogTitles
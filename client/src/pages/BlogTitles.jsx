import React, { useState } from 'react'
import { Hash, Sparkles } from 'lucide-react'

const BlogTitles = () => {
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
  const [titles, setTitles] = useState([])

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (!keyword) return

    setTitles([
      `10 ${keyword} Trends in ${selectedCategory}`,
      `How ${keyword} is Changing ${selectedCategory}`,
      `Beginner’s Guide to ${keyword}`,
      `Top ${keyword} Ideas for ${selectedCategory}`,
      `${keyword}: What You Need to Know`,
    ])
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
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
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
            className="mt-6 w-full py-2 rounded-lg bg-linear-to-r from-fuchsia-500 to-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Hash className="w-4" />
            Generate title
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

          {titles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
              <Hash className="w-10 h-10 mb-2 opacity-40" />
              Enter keywords and click “Generate Titles” to get started
            </div>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700">
              {titles.map((title, i) => (
                <li
                  key={i}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}

export default BlogTitles
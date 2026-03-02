import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-US')
    : '—'

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <div className="max-w-[75%]">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {item.prompt}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {item.type} – {date}
          </p>
        </div>

        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium">
          {item.type}
        </span>
      </div>

      {expanded && (
        <div className="mt-3">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="generated"
              className="w-full max-w-md rounded-lg border"
            />
          ) : (
            <div
              className="reset-tw max-h-48 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {item.content}
              </Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem
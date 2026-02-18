import { useState } from 'react'
import { getCoverStyle, STATUS_CONFIG } from './BookCard'

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-lg ${s <= rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
      ))}
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BookDetail({ book, onBack, onEdit, onDelete, onAddComment, onDeleteComment }) {
  const [commentText, setCommentText] = useState('')
  const status = STATUS_CONFIG[book.status] || STATUS_CONFIG['want-to-read']
  const comments = book.comments || []

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(commentText.trim())
    setCommentText('')
  }

  return (
    <div className="max-w-4xl">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la bibliothèque
      </button>

      {/* Book card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
        <div className="flex flex-col sm:flex-row">
          {/* Cover */}
          <div className="sm:w-48 lg:w-56 flex-shrink-0">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-64 sm:h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-64 sm:h-full min-h-48 flex items-center justify-center"
                style={getCoverStyle(book.title)}
              >
                <span className="text-white text-7xl font-bold opacity-20">
                  {book.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className={`inline-flex text-xs px-2.5 py-1 rounded-full border font-medium mb-3 ${status.badge}`}>
                  {status.label}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-1">{book.title}</h1>
                <p className="text-slate-400 text-lg">{book.author}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={onEdit}
                  title="Modifier"
                  className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={onDelete}
                  title="Supprimer"
                  className="p-2.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-5 space-y-2.5">
              {book.genre && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-28">Genre</span>
                  <span className="text-slate-200 text-sm bg-slate-800 px-2.5 py-0.5 rounded-full">{book.genre}</span>
                </div>
              )}
              {book.rating > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-28">Note</span>
                  <div className="flex items-center gap-2">
                    <Stars rating={book.rating} />
                    <span className="text-slate-400 text-sm">{book.rating}/5</span>
                  </div>
                </div>
              )}
              {book.dateRead && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-28">Lu le</span>
                  <span className="text-slate-300 text-sm">{formatDate(book.dateRead)}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm w-28">Ajouté le</span>
                <span className="text-slate-400 text-sm">{formatDate(book.addedAt)}</span>
              </div>
            </div>

            {/* Notes */}
            {book.notes && (
              <div className="mt-5 p-4 bg-slate-800/70 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Notes personnelles</p>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{book.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Commentaires
          {comments.length > 0 && (
            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
          )}
        </h2>

        {/* Add comment */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
              M
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Partagez vos impressions, une citation, une anecdote..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(e)
                }}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-slate-500"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-slate-600 text-xs">Ctrl+Entrée pour publier</p>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm">Aucun commentaire pour l'instant. Soyez le premier !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 group">
                <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  M
                </div>
                <div className="flex-1 bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-xs">{formatDate(comment.date)}</span>
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      title="Supprimer"
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

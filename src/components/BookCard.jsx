const GRADIENTS = [
  ['#7c3aed', '#2e1065'],
  ['#1d4ed8', '#1e3a5f'],
  ['#047857', '#052e16'],
  ['#b91c1c', '#450a0a'],
  ['#b45309', '#451a03'],
  ['#0e7490', '#083344'],
  ['#7e22ce', '#3b0764'],
  ['#0f766e', '#042f2e'],
]

export function getCoverStyle(title) {
  const sum = [...(title || 'A')].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const [from, to] = GRADIENTS[sum % GRADIENTS.length]
  return { background: `linear-gradient(135deg, ${from}, ${to})` }
}

export const STATUS_CONFIG = {
  read: { label: 'Lu', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  reading: { label: 'En cours', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'want-to-read': { label: 'À lire', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-xs">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= rating ? 'text-amber-400' : 'text-slate-700'}>★</span>
      ))}
    </div>
  )
}

function ActionBtn({ onClick, title, hoverColor, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 bg-white/10 ${hoverColor} text-white rounded-lg transition-colors backdrop-blur-sm`}
    >
      {children}
    </button>
  )
}

export default function BookCard({ book, viewMode, onView, onEdit, onDelete }) {
  const status = STATUS_CONFIG[book.status] || STATUS_CONFIG['want-to-read']

  const eyeIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
  const editIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
  const trashIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4 p-3 hover:border-slate-700 transition-all group">
        <div
          className="w-12 h-16 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer"
          onClick={onView}
        >
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={getCoverStyle(book.title)}>
              {book.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
          <h3 className="text-white font-semibold truncate text-sm">{book.title}</h3>
          <p className="text-slate-400 text-xs truncate mt-0.5">{book.author}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {book.genre && <span className="text-xs text-slate-500">{book.genre}</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${status.badge}`}>{status.label}</span>
            {book.rating > 0 && <Stars rating={book.rating} />}
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={onView} title="Voir" className="p-2 bg-slate-800 hover:bg-violet-600 text-slate-400 hover:text-white rounded-lg transition-colors">{eyeIcon}</button>
          <button onClick={onEdit} title="Modifier" className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors">{editIcon}</button>
          <button onClick={onDelete} title="Supprimer" className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors">{trashIcon}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all hover:-translate-y-1 group cursor-pointer">
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden" onClick={onView}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={getCoverStyle(book.title)}>
            <span className="text-white text-5xl font-bold opacity-30">
              {book.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border backdrop-blur-sm font-medium ${status.badge}`}>
            {status.label}
          </span>
        </div>

        {/* Hover actions overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <ActionBtn onClick={(e) => { e.stopPropagation(); onView() }} title="Voir" hoverColor="hover:bg-violet-600">{eyeIcon}</ActionBtn>
          <ActionBtn onClick={(e) => { e.stopPropagation(); onEdit() }} title="Modifier" hoverColor="hover:bg-blue-600">{editIcon}</ActionBtn>
          <ActionBtn onClick={(e) => { e.stopPropagation(); onDelete() }} title="Supprimer" hoverColor="hover:bg-red-600">{trashIcon}</ActionBtn>
        </div>
      </div>

      {/* Info */}
      <div className="p-3" onClick={onView}>
        {book.rating > 0 && <Stars rating={book.rating} />}
        <h3 className="text-white font-semibold text-sm mt-1 line-clamp-2 leading-snug">{book.title}</h3>
        <p className="text-slate-400 text-xs mt-0.5 truncate">{book.author}</p>
        {book.genre && <p className="text-slate-600 text-xs mt-1">{book.genre}</p>}
      </div>
    </div>
  )
}

import { useState } from 'react'

const GENRES = [
  'Roman', 'Science-Fiction', 'Fantasy', 'Thriller', 'Policier',
  'Biographie', 'Histoire', 'Science', 'Philosophie',
  'Développement personnel', 'Classique', 'Horreur', 'Jeunesse',
  'Manga', 'BD', 'Poésie', 'Autre',
]

function StarPicker({ rating, onRate }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onRate(s === rating ? 0 : s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className={`text-2xl transition-all hover:scale-110 ${
            s <= (hovered || rating) ? 'text-amber-400' : 'text-slate-700'
          }`}
        >
          ★
        </button>
      ))}
      <span className="text-slate-500 text-sm ml-1">
        {rating > 0 ? `${rating}/5` : 'Non noté'}
      </span>
    </div>
  )
}

const inputClass = 'w-full bg-slate-800 text-white border rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors placeholder-slate-500'
const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5'

export default function BookModal({ book, onSave, onClose }) {
  const [form, setForm] = useState({
    title: book?.title ?? '',
    author: book?.author ?? '',
    genre: book?.genre ?? '',
    coverUrl: book?.coverUrl ?? '',
    rating: book?.rating ?? 0,
    status: book?.status ?? 'want-to-read',
    dateRead: book?.dateRead ?? '',
    notes: book?.notes ?? '',
  })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    const val = e && e.target ? e.target.value : e
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Le titre est requis'
    if (!form.author.trim()) errs.author = "L'auteur est requis"
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave({ ...form, title: form.title.trim(), author: form.author.trim() })
  }

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {book ? 'Modifier le livre' : 'Ajouter un livre'}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {book ? 'Modifiez les informations ci-dessous' : 'Renseignez les informations du livre'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Title */}
          <div>
            <label className={labelClass}>Titre <span className="text-red-400">*</span></label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="Ex : Le Seigneur des Anneaux"
              className={`${inputClass} ${errors.title ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-violet-500'}`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label className={labelClass}>Auteur <span className="text-red-400">*</span></label>
            <input
              value={form.author}
              onChange={set('author')}
              placeholder="Ex : J.R.R. Tolkien"
              className={`${inputClass} ${errors.author ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-violet-500'}`}
            />
            {errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
          </div>

          {/* Genre + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Genre</label>
              <select
                value={form.genre}
                onChange={set('genre')}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="">Choisir...</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select
                value={form.status}
                onChange={set('status')}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="want-to-read">À lire</option>
                <option value="reading">En cours</option>
                <option value="read">Lu</option>
              </select>
            </div>
          </div>

          {/* Cover URL */}
          <div>
            <label className={labelClass}>
              URL de la couverture
              <span className="text-slate-500 font-normal ml-1">(optionnel)</span>
            </label>
            <input
              value={form.coverUrl}
              onChange={set('coverUrl')}
              placeholder="https://..."
              type="url"
              className={`${inputClass} border-slate-700 focus:border-violet-500`}
            />
            {form.coverUrl && (
              <div className="mt-2 w-12 h-16 rounded overflow-hidden border border-slate-700">
                <img
                  src={form.coverUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className={labelClass}>Note</label>
            <StarPicker rating={form.rating} onRate={(r) => setForm(prev => ({ ...prev, rating: r }))} />
          </div>

          {/* Date read (only when status is 'read') */}
          {form.status === 'read' && (
            <div>
              <label className={labelClass}>Date de lecture</label>
              <input
                type="date"
                value={form.dateRead}
                onChange={set('dateRead')}
                max={new Date().toISOString().split('T')[0]}
                className={`${inputClass} border-slate-700 focus:border-violet-500`}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes personnelles</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              placeholder="Vos impressions, un résumé, des citations..."
              rows={3}
              className={`${inputClass} border-slate-700 focus:border-violet-500 resize-none`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-violet-900/40"
            >
              {book ? 'Enregistrer' : '+ Ajouter le livre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

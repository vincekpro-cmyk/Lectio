import { useState, useMemo } from 'react'
import BookCard from './BookCard'

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'read', label: 'Lu' },
  { value: 'reading', label: 'En cours' },
  { value: 'want-to-read', label: 'À lire' },
]

const SORT_OPTIONS = [
  { value: 'addedAt-desc', label: 'Ajouté récemment' },
  { value: 'addedAt-asc', label: 'Ajouté anciennement' },
  { value: 'title-asc', label: 'Titre A→Z' },
  { value: 'title-desc', label: 'Titre Z→A' },
  { value: 'author-asc', label: 'Auteur A→Z' },
  { value: 'rating-desc', label: 'Mieux notés' },
  { value: 'dateRead-desc', label: 'Lu récemment' },
]

const selectClass = 'bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 cursor-pointer'

export default function Library({ books, onView, onEdit, onDelete, onAdd }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [sortBy, setSortBy] = useState('addedAt-desc')
  const [viewMode, setViewMode] = useState('grid')

  const genres = useMemo(() => [...new Set(books.map(b => b.genre).filter(Boolean))].sort(), [books])

  const filtered = useMemo(() => {
    let result = books.filter(b => {
      const q = search.toLowerCase()
      const matchSearch = !search ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.genre || '').toLowerCase().includes(q)
      const matchStatus = !statusFilter || b.status === statusFilter
      const matchGenre = !genreFilter || b.genre === genreFilter
      return matchSearch && matchStatus && matchGenre
    })

    const [field, dir] = sortBy.split('-')
    result = [...result].sort((a, b) => {
      let av = a[field] ?? ''
      let bv = b[field] ?? ''
      if (field === 'rating') { av = Number(av); bv = Number(bv) }
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [books, search, statusFilter, genreFilter, sortBy])

  const hasFilters = search || statusFilter || genreFilter

  const readCount = books.filter(b => b.status === 'read').length
  const readingCount = books.filter(b => b.status === 'reading').length
  const wantCount = books.filter(b => b.status === 'want-to-read').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Ma Bibliothèque</h2>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-emerald-400">{readCount} lu</span>
            <span className="text-blue-400">{readingCount} en cours</span>
            <span className="text-amber-400">{wantCount} à lire</span>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            title="Vue grille"
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Vue liste"
            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher titre, auteur, genre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-500 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} className={selectClass}>
          <option value="">Tous les genres</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-slate-400 text-sm">
            <span className="text-white font-medium">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setGenreFilter('') }}
            className="text-xs text-violet-400 hover:text-violet-300 underline"
          >
            Effacer les filtres
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="text-7xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {books.length === 0 ? 'Votre bibliothèque est vide' : 'Aucun résultat'}
          </h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            {books.length === 0
              ? 'Commencez par ajouter votre premier livre !'
              : 'Essayez de modifier vos critères de recherche.'}
          </p>
          {books.length === 0 && (
            <button
              onClick={onAdd}
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              + Ajouter mon premier livre
            </button>
          )}
        </div>
      )}

      {/* Grid / List */}
      {filtered.length > 0 && (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'flex flex-col gap-3'
        }>
          {filtered.map(book => (
            <BookCard
              key={book.id}
              book={book}
              viewMode={viewMode}
              onView={() => onView(book.id)}
              onEdit={() => onEdit(book.id)}
              onDelete={() => onDelete(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar({ currentView, onNavigate, onAddBook, readCount, totalCount }) {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-violet-900/50">
              📚
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-base leading-tight">Lectio</h1>
              <p className="text-slate-500 text-xs">{readCount} lu · {totalCount} au total</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('library')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'library' || currentView === 'detail'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="hidden sm:inline">Bibliothèque</span>
            </button>
            <button
              onClick={() => onNavigate('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'stats'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Statistiques</span>
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={onAddBook}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-violet-900/40 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

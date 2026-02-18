function StatCard({ label, value, sub, accent = 'text-violet-400' }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-500 text-xs uppercase tracking-wider font-medium mb-2">{label}</p>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function Bar({ pct, color }) {
  return (
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }}
      />
    </div>
  )
}

const THIS_YEAR = new Date().getFullYear()

export default function Stats({ books }) {
  const readBooks = books.filter(b => b.status === 'read')
  const readingBooks = books.filter(b => b.status === 'reading')
  const wantBooks = books.filter(b => b.status === 'want-to-read')
  const ratedBooks = books.filter(b => b.rating > 0)

  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((s, b) => s + b.rating, 0) / ratedBooks.length).toFixed(1)
    : null

  const booksThisYear = readBooks.filter(b => b.dateRead && new Date(b.dateRead).getFullYear() === THIS_YEAR)

  // Genre counts
  const genreCounts = books.reduce((acc, b) => {
    if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1
    return acc
  }, {})
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxGenre = topGenres[0]?.[1] || 1

  // Author counts
  const authorCounts = books.reduce((acc, b) => {
    if (b.author) acc[b.author] = (acc[b.author] || 0) + 1
    return acc
  }, {})
  const topAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Rating distribution (5 → 1)
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: books.filter(b => b.rating === r).length,
  }))
  const maxRatingCount = Math.max(...ratingDist.map(r => r.count), 1)

  // Recent reads (sorted by dateRead)
  const recentReads = readBooks
    .filter(b => b.dateRead)
    .sort((a, b) => b.dateRead.localeCompare(a.dateRead))
    .slice(0, 5)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Statistiques</h2>
        <p className="text-slate-400 text-sm mt-1">Votre activité de lecture en un coup d'œil</p>
      </div>

      {books.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <div className="text-5xl mb-3">📊</div>
          <p>Ajoutez des livres pour voir vos statistiques.</p>
        </div>
      )}

      {books.length > 0 && (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total"
              value={books.length}
              sub="livres dans la collection"
            />
            <StatCard
              label="Lus"
              value={readBooks.length}
              sub={`dont ${booksThisYear.length} cette année`}
              accent="text-emerald-400"
            />
            <StatCard
              label="En cours"
              value={readingBooks.length}
              sub={`${wantBooks.length} dans la liste`}
              accent="text-blue-400"
            />
            <StatCard
              label="Note moyenne"
              value={avgRating ? `${avgRating} ★` : '—'}
              sub={ratedBooks.length > 0 ? `sur ${ratedBooks.length} livres notés` : 'aucun livre noté'}
              accent="text-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Status breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Répartition par statut</h3>
              <div className="space-y-4">
                {[
                  { key: 'read', label: 'Lu', count: readBooks.length, color: 'bg-emerald-500', text: 'text-emerald-400' },
                  { key: 'reading', label: 'En cours', count: readingBooks.length, color: 'bg-blue-500', text: 'text-blue-400' },
                  { key: 'want-to-read', label: 'À lire', count: wantBooks.length, color: 'bg-amber-500', text: 'text-amber-400' },
                ].map(({ key, label, count, color, text }) => {
                  const pct = books.length > 0 ? (count / books.length) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className={text}>{label}</span>
                        <span className="text-slate-400">{count} ({Math.round(pct)}%)</span>
                      </div>
                      <Bar pct={pct} color={color} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rating distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Distribution des notes</h3>
              {ratedBooks.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun livre noté pour l'instant.</p>
              ) : (
                <div className="space-y-3">
                  {ratingDist.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-amber-400 text-sm w-6 text-right">{rating}</span>
                      <span className="text-amber-400 text-xs">★</span>
                      <div className="flex-1">
                        <Bar pct={(count / maxRatingCount) * 100} color="bg-amber-500" />
                      </div>
                      <span className="text-slate-500 text-sm w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top genres */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Genres les plus lus</h3>
              {topGenres.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun genre renseigné.</p>
              ) : (
                <div className="space-y-3">
                  {topGenres.map(([genre, count], i) => (
                    <div key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                          <span className="text-slate-300 text-sm">{genre}</span>
                        </div>
                        <span className="text-violet-400 font-semibold text-sm">{count}</span>
                      </div>
                      <Bar pct={(count / maxGenre) * 100} color="bg-violet-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top authors */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Auteurs favoris</h3>
              {topAuthors.length === 0 ? (
                <p className="text-slate-500 text-sm">Aucun auteur renseigné.</p>
              ) : (
                <div className="space-y-3">
                  {topAuthors.map(([author, count], i) => (
                    <div key={author} className="flex items-center gap-3 py-1.5 border-b border-slate-800 last:border-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-amber-500 text-amber-950' :
                        i === 1 ? 'bg-slate-400 text-slate-900' :
                        i === 2 ? 'bg-amber-700 text-amber-100' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="flex-1 text-slate-300 text-sm truncate">{author}</span>
                      <span className="text-slate-500 text-sm">{count} livre{count > 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent reads */}
          {recentReads.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-5">Dernières lectures</h3>
              <div className="space-y-1">
                {recentReads.map((book, i) => (
                  <div key={book.id} className={`flex items-center justify-between py-3 ${i < recentReads.length - 1 ? 'border-b border-slate-800' : ''}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-600 text-xs w-4 flex-shrink-0">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-slate-200 text-sm font-medium truncate">{book.title}</p>
                        <p className="text-slate-500 text-xs truncate">{book.author}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      {book.rating > 0 && (
                        <p className="text-amber-400 text-xs">{'★'.repeat(book.rating)}</p>
                      )}
                      <p className="text-slate-500 text-xs">
                        {new Date(book.dateRead).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

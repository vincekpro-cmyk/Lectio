import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Navbar from './components/Navbar'
import Library from './components/Library'
import BookDetail from './components/BookDetail'
import Stats from './components/Stats'
import BookModal from './components/BookModal'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const INITIAL_BOOKS = [
  {
    id: 'b1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Classique',
    coverUrl: '',
    rating: 5,
    status: 'read',
    dateRead: '2024-01-15',
    notes: "Un chef-d'œuvre intemporel sur l'amitié et la pureté de l'enfance.",
    comments: [{ id: 'c1', text: 'Un livre magnifique, relu plusieurs fois !', date: '2024-01-20' }],
    addedAt: '2024-01-15',
  },
  {
    id: 'b2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science-Fiction',
    coverUrl: '',
    rating: 5,
    status: 'read',
    dateRead: '2024-03-20',
    notes: 'Un monument de la science-fiction. Riche et complexe.',
    comments: [],
    addedAt: '2024-03-20',
  },
  {
    id: 'b3',
    title: 'Fondation',
    author: 'Isaac Asimov',
    genre: 'Science-Fiction',
    coverUrl: '',
    rating: 4,
    status: 'reading',
    dateRead: '',
    notes: 'En cours de lecture, très captivant.',
    comments: [],
    addedAt: '2025-01-05',
  },
  {
    id: 'b4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Histoire',
    coverUrl: '',
    rating: 0,
    status: 'want-to-read',
    dateRead: '',
    notes: 'Recommandé par plusieurs amis.',
    comments: [],
    addedAt: '2025-01-10',
  },
  {
    id: 'b5',
    title: "L'Alchimiste",
    author: 'Paulo Coelho',
    genre: 'Roman',
    coverUrl: '',
    rating: 4,
    status: 'read',
    dateRead: '2023-11-05',
    notes: 'Une belle parabole sur la quête de soi.',
    comments: [],
    addedAt: '2023-11-05',
  },
]

export default function App() {
  const [books, setBooks] = useLocalStorage('bookshelf-v1', INITIAL_BOOKS)
  const [currentView, setCurrentView] = useState('library')
  const [selectedBookId, setSelectedBookId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingBookId, setEditingBookId] = useState(null)

  const selectedBook = books.find(b => b.id === selectedBookId)
  const editingBook = editingBookId ? books.find(b => b.id === editingBookId) : null

  const saveBook = (bookData) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === editingBookId ? { ...b, ...bookData } : b))
    } else {
      const newBook = {
        ...bookData,
        id: generateId(),
        comments: [],
        addedAt: new Date().toISOString().split('T')[0],
      }
      setBooks(prev => [newBook, ...prev])
    }
    setShowModal(false)
    setEditingBookId(null)
  }

  const deleteBook = (id) => {
    if (!confirm('Supprimer ce livre définitivement ?')) return
    setBooks(prev => prev.filter(b => b.id !== id))
    if (selectedBookId === id) {
      setCurrentView('library')
      setSelectedBookId(null)
    }
  }

  const addComment = (bookId, text) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId
        ? { ...b, comments: [...(b.comments || []), { id: generateId(), text, date: new Date().toISOString().split('T')[0] }] }
        : b
    ))
  }

  const deleteComment = (bookId, commentId) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId
        ? { ...b, comments: (b.comments || []).filter(c => c.id !== commentId) }
        : b
    ))
  }

  const viewBook = (id) => {
    setSelectedBookId(id)
    setCurrentView('detail')
  }

  const openEdit = (id) => {
    setEditingBookId(id)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditingBookId(null)
    setShowModal(true)
  }

  const navigate = (view) => {
    setCurrentView(view)
    setSelectedBookId(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        onAddBook={openAdd}
        readCount={books.filter(b => b.status === 'read').length}
        totalCount={books.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'library' && (
          <Library
            books={books}
            onView={viewBook}
            onEdit={openEdit}
            onDelete={deleteBook}
            onAdd={openAdd}
          />
        )}

        {currentView === 'detail' && selectedBook && (
          <BookDetail
            book={selectedBook}
            onBack={() => navigate('library')}
            onEdit={() => openEdit(selectedBook.id)}
            onDelete={() => deleteBook(selectedBook.id)}
            onAddComment={(text) => addComment(selectedBook.id, text)}
            onDeleteComment={(cid) => deleteComment(selectedBook.id, cid)}
          />
        )}

        {currentView === 'stats' && (
          <Stats books={books} />
        )}
      </main>

      {showModal && (
        <BookModal
          book={editingBook}
          onSave={saveBook}
          onClose={() => { setShowModal(false); setEditingBookId(null) }}
        />
      )}
    </div>
  )
}

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Book, Excerpt, ViewMode } from './types';
import { TopBar } from './components/TopBar';
import { FeedView } from './components/FeedView';
import { ArchiveView } from './components/ArchiveView';
import { BookshelfView } from './components/BookshelfView';
import { AddExcerptModal } from './components/AddExcerptModal';
import { BookDetailModal } from './components/BookDetailModal';
import { SettingsModal } from './components/SettingsModal';

// Mock initial data
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: '活着',
    author: '余华',
    tags: ['小说', '经典', '人生'],
    createdAt: Date.now() - 10000000,
    overallReview: '一本让人读完久久不能平静的书，福贵的一生是无数中国人的缩影。'
  },
  {
    id: '2',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    tags: ['历史', '科普', '思维'],
    createdAt: Date.now() - 5000000,
  }
];

const INITIAL_EXCERPTS: Excerpt[] = [
  {
    id: '1',
    bookId: '1',
    text: '人是为了活着本身而活着的，而不是为了活着之外的任何事物所活着。',
    thought: '这句话道出了生命的本质，剥离了一切外在的附加值，生命本身就是意义。',
    chapter: '序言',
    createdAt: Date.now() - 8000000,
  },
  {
    id: '2',
    bookId: '1',
    text: '没有什么比时间更具有说服力了，因为时间无需通知我们就可以改变一切。',
    chapter: '第一章',
    createdAt: Date.now() - 7000000,
  },
  {
    id: '3',
    bookId: '2',
    text: '智人之所以能征服世界，是因为有独特的语言。',
    thought: '虚构故事的能力让我们能够大规模协作。',
    chapter: '认知革命',
    createdAt: Date.now() - 4000000,
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>((localStorage.getItem('defaultView') as ViewMode) || 'feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [excerpts, setExcerpts] = useState<Excerpt[]>(INITIAL_EXCERPTS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingExcerpt, setEditingExcerpt] = useState<Partial<Excerpt> & { bookTitle?: string } | undefined>(undefined);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [drafts, setDrafts] = useState<(Partial<Excerpt> & { bookTitle?: string })[]>([]);

  const handleSaveExcerpt = (excerptData: Omit<Excerpt, 'id' | 'createdAt'>, bookData: Partial<Book>) => {
    let bookId = excerptData.bookId;
    
    // Find or create book
    if (!bookId || editingExcerpt) {
      const existingBook = books.find(b => b.title === bookData.title);
      if (existingBook) {
        bookId = existingBook.id;
        // Update tags if new ones added
        let updated = false;
        let newTags = existingBook.tags;
        if (bookData.tags && bookData.tags.length > 0) {
          newTags = Array.from(new Set([...existingBook.tags, ...bookData.tags]));
          updated = true;
        }
        if (bookData.author && bookData.author !== existingBook.author) {
          updated = true;
        }
        
        if (updated) {
          setBooks(books.map(b => b.id === bookId ? { ...b, tags: newTags, author: bookData.author || b.author } : b));
        }
      } else {
        bookId = Date.now().toString();
        const newBook: Book = {
          id: bookId,
          title: bookData.title || '未知书籍',
          author: bookData.author || '未知作者',
          tags: bookData.tags || [],
          createdAt: Date.now(),
        };
        setBooks([...books, newBook]);
      }
    }

    if (editingExcerpt && editingExcerpt.id) {
      // Update existing excerpt
      setExcerpts(excerpts.map(e => e.id === editingExcerpt.id ? {
        ...e,
        ...excerptData,
        bookId
      } : e));
    } else {
      // Create new excerpt
      const newExcerpt: Excerpt = {
        ...excerptData,
        id: Date.now().toString(),
        bookId,
        createdAt: Date.now(),
      };
      setExcerpts([newExcerpt, ...excerpts]);
    }
    
    setEditingExcerpt(undefined);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setSelectedBook(updatedBook);
  };

  const openEditModal = (excerpt: Excerpt) => {
    setEditingExcerpt(excerpt);
    setIsAddModalOpen(true);
  };

  // Filter excerpts and books based on search query
  const filteredExcerpts = excerpts.filter(e => {
    const book = books.find(b => b.id === e.bookId);
    const searchLower = searchQuery.toLowerCase();
    return (
      e.text.toLowerCase().includes(searchLower) ||
      e.thought?.toLowerCase().includes(searchLower) ||
      book?.title.toLowerCase().includes(searchLower) ||
      book?.author.toLowerCase().includes(searchLower)
    );
  });

  const filteredBooks = books.filter(b => {
    const searchLower = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(searchLower) ||
      b.author.toLowerCase().includes(searchLower) ||
      excerpts.some(e => e.bookId === b.id && (e.text.toLowerCase().includes(searchLower) || e.thought?.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--theme-bg-light)] via-[var(--theme-bg-subtle)] to-[var(--theme-border)] text-[var(--theme-primary)] font-serif selection:bg-[var(--theme-accent-light)] selection:text-white">
      <TopBar 
        currentView={viewMode} 
        onViewChange={setViewMode} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      <main className="relative">
        {viewMode === 'feed' && (
          <FeedView 
            books={books} 
            excerpts={filteredExcerpts} 
            onEditExcerpt={openEditModal}
          />
        )}
        {viewMode === 'archive' && (
          <ArchiveView 
            books={filteredBooks} 
            excerpts={filteredExcerpts} 
            onEditExcerpt={openEditModal}
            onSelectBook={setSelectedBook}
          />
        )}
        {viewMode === 'bookshelf' && (
          <BookshelfView 
            books={filteredBooks} 
            excerpts={filteredExcerpts} 
            onSelectBook={setSelectedBook}
          />
        )}
      </main>

      {/* Floating Action Button - Show in all views */}
      <button
        onClick={() => {
          setEditingExcerpt(undefined);
          setIsAddModalOpen(true);
        }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white rounded-full shadow-[0_8px_32px_rgba(194,123,160,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40 border border-white/20 backdrop-blur-md"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        drafts={drafts}
        onEditDraft={(draft, index) => {
          setEditingExcerpt(draft);
          setIsSettingsModalOpen(false);
          setIsAddModalOpen(true);
          // Optional: remove from drafts when editing
          setDrafts(prev => prev.filter((_, i) => i !== index));
        }}
        onDeleteDraft={(index) => {
          setDrafts(prev => prev.filter((_, i) => i !== index));
        }}
      />

      <AddExcerptModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExcerpt(undefined);
        }}
        onSave={handleSaveExcerpt}
        onSaveDraft={(draft) => setDrafts(prev => [draft, ...prev])}
        books={books}
        initialExcerpt={editingExcerpt}
      />

      <BookDetailModal
        book={selectedBook}
        excerpts={excerpts}
        onClose={() => setSelectedBook(null)}
        onUpdateBook={handleUpdateBook}
        onEditExcerpt={openEditModal}
      />
    </div>
  );
}

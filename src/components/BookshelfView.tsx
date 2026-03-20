import { motion } from 'motion/react';
import { Book, Excerpt } from '../types';
import { BookOpen } from 'lucide-react';

interface BookshelfViewProps {
  books: Book[];
  excerpts: Excerpt[];
  onSelectBook: (book: Book) => void;
}

export function BookshelfView({ books, excerpts, onSelectBook }: BookshelfViewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {books.map((book, index) => {
          const bookExcerpts = excerpts.filter(e => e.bookId === book.id);
          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectBook(book)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative w-full aspect-[2/3] rounded-r-xl rounded-l-sm shadow-[0_8px_32px_0_rgba(107,76,58,0.15)] group-hover:shadow-[0_16px_48px_0_rgba(107,76,58,0.25)] transition-all duration-300 transform group-hover:-translate-y-2 bg-white/40 backdrop-blur-md flex items-center justify-center overflow-hidden border-l-4 border-[var(--theme-accent)]/40 border-y border-r border-white/50">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-4 text-center">
                    <BookOpen className="w-12 h-12 text-[var(--theme-accent)]/50 mx-auto mb-4" />
                    <h3 className="text-[var(--theme-primary)] font-serif font-bold text-lg line-clamp-3 leading-tight">
                      {book.title}
                    </h3>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-accent-light)]/20 to-transparent opacity-50" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-white/60 backdrop-blur-md text-[var(--theme-primary)] text-xs px-2.5 py-1 rounded-full font-mono border border-white/50 shadow-sm">
                  {bookExcerpts.length} 摘
                </div>
              </div>
              <div className="mt-4 text-center px-2">
                <h4 className="font-medium text-[var(--theme-primary)] line-clamp-1 font-serif">{book.title}</h4>
                <p className="text-sm text-[var(--theme-secondary)] line-clamp-1">{book.author}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {books.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--theme-secondary)]">书架空空如也，快去添加书摘吧！</p>
        </div>
      )}
    </div>
  );
}

import { motion } from 'motion/react';
import { Book, Excerpt } from '../types';
import { format } from 'date-fns';
import { Quote, Edit3, MessageSquare } from 'lucide-react';

interface FeedViewProps {
  books: Book[];
  excerpts: Excerpt[];
  onEditExcerpt: (excerpt: Excerpt) => void;
}

export function FeedView({ books, excerpts, onEditExcerpt }: FeedViewProps) {
  const sortedExcerpts = [...excerpts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-32">
      {sortedExcerpts.map((excerpt, index) => {
        const book = books.find(b => b.id === excerpt.bookId);
        return (
          <motion.article
            key={excerpt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(107,76,58,0.1)] border border-white/50 relative group"
          >
            <button
              onClick={() => onEditExcerpt(excerpt)}
              className="absolute top-1 right-1 p-2 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] hover:bg-white/40 rounded-full opacity-100 transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4 pr-8">
              <Quote className="w-8 h-8 text-[var(--theme-accent-light)] shrink-0" />
              <p className="text-[var(--theme-primary)] text-lg leading-relaxed font-serif">
                {excerpt.text}
              </p>
            </div>

            {excerpt.thought && (
              <div className="mt-4 mb-6 p-4 bg-[var(--theme-bg-subtle)]/50 rounded-xl border border-[var(--theme-border)] flex gap-3">
                <MessageSquare className="w-5 h-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                <p className="text-[var(--theme-secondary)] text-sm leading-relaxed">
                  {excerpt.thought}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--theme-border)]/50">
              <div className="flex items-center gap-3">
                {book?.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-8 h-12 object-cover rounded shadow-sm" />
                ) : (
                  <div className="w-8 h-12 bg-[var(--theme-accent-light)]/30 rounded flex items-center justify-center text-[var(--theme-accent)] text-xs font-bold border border-[var(--theme-accent-light)]/50">
                    {book?.title.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--theme-primary)]">{book?.title || '未知书籍'}</h4>
                  <p className="text-xs text-[var(--theme-secondary)]">{book?.author || '未知作者'}</p>
                </div>
              </div>
              <time className="text-xs text-[var(--theme-secondary)] font-mono">
                {format(new Date(excerpt.createdAt), 'MMM d, yyyy')}
              </time>
            </div>
          </motion.article>
        );
      })}
      {excerpts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--theme-secondary)]">还没有书摘，点击下方按钮添加吧！</p>
        </div>
      )}
    </div>
  );
}

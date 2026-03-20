import { motion, AnimatePresence } from 'motion/react';
import { Book, Excerpt } from '../types';
import { Folder, FolderOpen, ChevronDown, ChevronUp, Quote, Edit3, Settings2 } from 'lucide-react';
import { useState } from 'react';

interface ArchiveViewProps {
  books: Book[];
  excerpts: Excerpt[];
  onEditExcerpt: (excerpt: Excerpt) => void;
  onSelectBook: (book: Book) => void;
}

export function ArchiveView({ books, excerpts, onEditExcerpt, onSelectBook }: ArchiveViewProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-32">
      <div className="space-y-4">
        {books.map((book, index) => {
          const bookExcerpts = excerpts.filter(e => e.bookId === book.id).sort((a, b) => b.createdAt - a.createdAt);
          const isExpanded = expandedBookId === book.id;

          if (bookExcerpts.length === 0) return null;

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/30 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(107,76,58,0.1)] rounded-2xl overflow-hidden"
            >
              <div
                onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--theme-accent-light)]/20 rounded-xl">
                    {isExpanded ? (
                      <FolderOpen className="w-6 h-6 text-[var(--theme-accent)]" />
                    ) : (
                      <Folder className="w-6 h-6 text-[var(--theme-accent)]" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-[var(--theme-primary)] font-serif">{book.title}</h3>
                    <p className="text-sm text-[var(--theme-secondary)]">{book.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBook(book);
                    }}
                    className="p-2 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] hover:bg-white/40 rounded-full transition-all"
                    title="编辑档案/评价"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-[var(--theme-bg-subtle)]/50 text-[var(--theme-secondary)] rounded-full text-xs font-medium border border-[var(--theme-border)] hidden sm:inline-block">
                    {bookExcerpts.length} 条书摘
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[var(--theme-secondary)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--theme-secondary)]" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 space-y-4 border-t border-white/30 bg-white/10">
                      {bookExcerpts.map((excerpt, i) => (
                        <motion.div
                          key={excerpt.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-4 p-4 rounded-xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/50 relative group"
                        >
                          <button
                            onClick={() => onEditExcerpt(excerpt)}
                            className="absolute top-2 right-2 p-2 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] hover:bg-white/40 rounded-full opacity-100 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <Quote className="w-5 h-5 text-[var(--theme-accent-light)] shrink-0 mt-1" />
                          <div className="space-y-2 flex-1 pr-8">
                            <p className="text-[var(--theme-primary)] leading-relaxed font-serif">
                              {excerpt.text}
                            </p>
                            {excerpt.thought && (
                              <p className="text-sm text-[var(--theme-secondary)] bg-[var(--theme-bg-subtle)]/50 p-3 rounded-lg border border-[var(--theme-border)]/50">
                                想法: {excerpt.thought}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {books.filter(b => excerpts.some(e => e.bookId === b.id)).length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--theme-secondary)]">暂无档案，快去添加书摘吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}

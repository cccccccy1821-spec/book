import { motion, AnimatePresence } from 'motion/react';
import { Book, Excerpt } from '../types';
import { X, Star, ImageIcon, ChevronDown, ChevronUp, Camera, Edit3 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface BookDetailModalProps {
  book: Book | null;
  excerpts: Excerpt[];
  onClose: () => void;
  onUpdateBook: (book: Book) => void;
  onEditExcerpt: (excerpt: Excerpt) => void;
}

export function BookDetailModal({ book, excerpts, onClose, onUpdateBook, onEditExcerpt }: BookDetailModalProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewText, setReviewText] = useState(book?.overallReview || '');
  const [isEditingBookInfo, setIsEditingBookInfo] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (book) {
      setReviewText(book.overallReview || '');
      setEditTitle(book.title);
      setEditAuthor(book.author);
      setIsEditingReview(false);
      setIsEditingBookInfo(false);
    }
  }, [book]);

  if (!book) return null;

  const bookExcerpts = excerpts.filter(e => e.bookId === book.id).sort((a, b) => b.createdAt - a.createdAt);

  const handleSaveReview = () => {
    onUpdateBook({ ...book, overallReview: reviewText });
    setIsEditingReview(false);
  };

  const handleSaveBookInfo = () => {
    if (!editTitle.trim()) return;
    onUpdateBook({ ...book, title: editTitle.trim(), author: editAuthor.trim() });
    setIsEditingBookInfo(false);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpdateBook({ ...book, coverImage: base64String });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-[0_8px_32px_0_rgba(107,76,58,0.2)] overflow-hidden flex flex-col"
        >
          <div className="flex items-start justify-between p-6 border-b border-white/30 bg-[var(--theme-bg-subtle)]/50">
            <div className="flex items-start gap-6">
              <div 
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-20 h-28 object-cover rounded-lg shadow-md border border-white/50" />
                ) : (
                  <div className="w-20 h-28 bg-[var(--theme-accent-light)]/20 rounded-lg flex items-center justify-center text-[var(--theme-accent)] font-bold text-2xl shadow-md border border-[var(--theme-accent-light)]/30">
                    {book.title.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-[var(--theme-primary)]/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleCoverUpload} 
                />
              </div>
              <div className="pt-1">
                {isEditingBookInfo ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full p-2 bg-white/50 border border-white/60 rounded-lg focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)] font-serif font-bold text-xl"
                      placeholder="书名"
                    />
                    <input
                      type="text"
                      value={editAuthor}
                      onChange={e => setEditAuthor(e.target.value)}
                      className="w-full p-2 bg-white/50 border border-white/60 rounded-lg focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)]"
                      placeholder="作者"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingBookInfo(false)} className="px-4 py-1.5 text-sm text-[var(--theme-secondary)] hover:bg-white/50 rounded-lg transition-colors">取消</button>
                      <button onClick={handleSaveBookInfo} className="px-4 py-1.5 text-sm bg-[var(--theme-accent)] text-white rounded-lg hover:bg-[var(--theme-accent-hover)] transition-colors shadow-sm">保存</button>
                    </div>
                  </div>
                ) : (
                  <div className="group relative pr-10">
                    <h2 className="text-2xl font-bold text-[var(--theme-primary)] font-serif">{book.title}</h2>
                    <p className="text-[var(--theme-secondary)] mt-1">{book.author}</p>
                    <button onClick={() => setIsEditingBookInfo(true)} className="absolute top-0 right-0 p-1.5 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] hover:bg-white/40 rounded-full opacity-100 transition-all">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {book.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-[var(--theme-accent-light)]/20 text-[var(--theme-accent)] rounded-full text-xs font-medium border border-[var(--theme-accent-light)]/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors self-start text-[var(--theme-secondary)]">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-transparent to-[var(--theme-bg-light)]/50">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--theme-primary)] flex items-center gap-2 font-serif">
                  <Star className="w-5 h-5 text-[var(--theme-accent)] fill-[var(--theme-accent)]" />
                  整体评价
                </h3>
                {!isEditingReview && (
                  <button onClick={() => setIsEditingReview(true)} className="p-2 bg-white/40 hover:bg-white/60 text-[var(--theme-accent)] rounded-full border border-white/50 transition-colors shadow-sm flex items-center justify-center" title="编辑评价">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditingReview ? (
                <div className="space-y-3">
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="写下你对这本书的整体评价..."
                    className="w-full h-32 p-4 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent resize-none shadow-inner text-[var(--theme-primary)] font-serif"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingReview(false)} className="px-4 py-2 text-sm text-[var(--theme-secondary)] hover:bg-white/50 rounded-lg transition-colors">
                      取消
                    </button>
                    <button onClick={handleSaveReview} className="px-4 py-2 text-sm bg-[var(--theme-accent)] text-white rounded-lg hover:bg-[var(--theme-accent-hover)] transition-colors shadow-sm">
                      保存评价
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--theme-bg-subtle)]/50 p-5 rounded-2xl border border-[var(--theme-border)]">
                  {book.overallReview ? (
                    <p className="text-[var(--theme-primary)] leading-relaxed whitespace-pre-wrap font-serif">{book.overallReview}</p>
                  ) : (
                    <p className="text-[var(--theme-secondary)] italic">暂无评价，点击编辑添加。</p>
                  )}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-6 flex items-center gap-2 font-serif">
                <span className="bg-[var(--theme-accent-light)]/20 text-[var(--theme-accent)] w-6 h-6 rounded-full flex items-center justify-center text-sm border border-[var(--theme-accent-light)]/30">
                  {bookExcerpts.length}
                </span>
                书摘列表
              </h3>
              <div className="space-y-6">
                {bookExcerpts.map(excerpt => (
                  <div key={excerpt.id} className="bg-white/30 backdrop-blur-sm border border-white/50 rounded-2xl p-5 shadow-[0_4px_20px_0_rgba(107,76,58,0.05)] relative group">
                    <button
                      onClick={() => { onClose(); onEditExcerpt(excerpt); }}
                      className="absolute top-2 right-2 p-2 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] hover:bg-white/40 rounded-full opacity-100 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {excerpt.chapter && (
                      <div className="text-xs font-medium text-[var(--theme-accent)] mb-3 uppercase tracking-wider">
                        {excerpt.chapter}
                      </div>
                    )}
                    <p className="text-[var(--theme-primary)] leading-relaxed font-serif mb-4 pr-8">
                      {excerpt.text}
                    </p>
                    {excerpt.thought && (
                      <div className="bg-[var(--theme-bg-subtle)]/50 p-4 rounded-xl text-sm text-[var(--theme-secondary)] mb-4 border border-[var(--theme-border)]/50">
                        <span className="font-semibold text-[var(--theme-primary)] mr-2">想法:</span>
                        {excerpt.thought}
                      </div>
                    )}
                    
                    {excerpt.originalImage && (
                      <div>
                        <button
                          onClick={() => setExpandedImage(expandedImage === excerpt.id ? null : excerpt.id)}
                          className="flex items-center gap-2 text-sm text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {expandedImage === excerpt.id ? '收起原图' : '查看原图'}
                          {expandedImage === excerpt.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        <AnimatePresence>
                          {expandedImage === excerpt.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden mt-4"
                            >
                              <img src={excerpt.originalImage} alt="Original excerpt" className="w-full rounded-xl border border-white/50 shadow-sm" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

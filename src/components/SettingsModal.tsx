import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Type, Archive, Trash2, Layout } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Excerpt, ViewMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: (Partial<Excerpt> & { bookTitle?: string })[];
  onEditDraft: (draft: Partial<Excerpt> & { bookTitle?: string }, index: number) => void;
  onDeleteDraft: (index: number) => void;
}

export function SettingsModal({ isOpen, onClose, drafts, onEditDraft, onDeleteDraft }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'drafts'>('appearance');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'default');
  const [fontSize, setFontSize] = useState(document.documentElement.getAttribute('data-font-size') || 'medium');
  const [defaultView, setDefaultView] = useState<ViewMode>((localStorage.getItem('defaultView') as ViewMode) || 'feed');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('defaultView', defaultView);
  }, [defaultView]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[85vh]"
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--theme-border)]/50 bg-white/50">
            <h2 className="text-xl font-bold text-[var(--theme-primary)] font-serif">设置</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <X className="w-6 h-6 text-[var(--theme-secondary)]" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 bg-white/30 border-r border-[var(--theme-border)]/50 p-4 space-y-2 overflow-y-auto">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'appearance' ? 'bg-[var(--theme-accent-light)] text-[var(--theme-primary)] shadow-sm' : 'text-[var(--theme-secondary)] hover:bg-white/50'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">外观设置</span>
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'drafts' ? 'bg-[var(--theme-accent-light)] text-[var(--theme-primary)] shadow-sm' : 'text-[var(--theme-secondary)] hover:bg-white/50'
                }`}
              >
                <Archive className="w-5 h-5" />
                <span className="font-medium">草稿箱</span>
                {drafts.length > 0 && (
                  <span className="ml-auto bg-[var(--theme-accent)] text-white text-xs px-2 py-0.5 rounded-full">
                    {drafts.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-white/20">
              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4 flex items-center gap-2">
                      <Type className="w-5 h-5 text-[var(--theme-accent)]" />
                      字体大小
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFontSize('small')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          fontSize === 'small' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        小
                      </button>
                      <button
                        onClick={() => setFontSize('medium')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          fontSize === 'medium' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        中
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          fontSize === 'large' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        大
                      </button>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-[var(--theme-accent)]" />
                      主题颜色
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('default')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'default' ? 'border-[var(--theme-accent)] bg-white/60 shadow-md' : 'border-transparent bg-white/40 hover:bg-white/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#5c4033] border-4 border-[#e8b4b8]" />
                        <span className="text-sm font-medium text-[#5c4033]">复古棕粉</span>
                      </button>
                      <button
                        onClick={() => setTheme('blue')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'blue' ? 'border-[var(--theme-accent)] bg-white/60 shadow-md' : 'border-transparent bg-white/40 hover:bg-white/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#2d3748] border-4 border-[#ebf8ff]" />
                        <span className="text-sm font-medium text-[#2d3748]">淡蓝灰白</span>
                      </button>
                      <button
                        onClick={() => setTheme('purple')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'purple' ? 'border-[var(--theme-accent)] bg-white/60 shadow-md' : 'border-transparent bg-white/40 hover:bg-white/50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#322659] border-4 border-[#faf5ff]" />
                        <span className="text-sm font-medium text-[#322659]">淡紫纯白</span>
                      </button>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-[var(--theme-accent)]" />
                      默认视图
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDefaultView('feed')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          defaultView === 'feed' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        动态
                      </button>
                      <button
                        onClick={() => setDefaultView('archive')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          defaultView === 'archive' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        档案
                      </button>
                      <button
                        onClick={() => setDefaultView('bookshelf')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all font-medium ${
                          defaultView === 'bookshelf' ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-light)] text-[var(--theme-primary)]' : 'border-transparent bg-white/40 text-[var(--theme-secondary)] hover:bg-white/50'
                        }`}
                      >
                        书架
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'drafts' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[var(--theme-primary)] mb-4 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-[var(--theme-accent)]" />
                    草稿箱
                  </h3>
                  {drafts.length === 0 ? (
                    <div className="text-center py-12 text-[var(--theme-secondary)]">
                      <Archive className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>草稿箱是空的</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {drafts.map((draft, index) => (
                        <div key={index} className="bg-white/50 p-4 rounded-xl border border-[var(--theme-border)]/50 relative group">
                          <p className="text-[var(--theme-primary)] line-clamp-2 mb-2">
                            {draft.text || '（无正文内容）'}
                          </p>
                          <div className="flex items-center justify-between text-sm text-[var(--theme-secondary)]">
                            <span>{draft.bookTitle || '未选择书籍'}</span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditDraft(draft, index)}
                                className="px-3 py-1 bg-[var(--theme-accent-light)] text-[var(--theme-primary)] rounded-lg hover:bg-[var(--theme-accent)] hover:text-white transition-colors"
                              >
                                继续编辑
                              </button>
                              <button
                                onClick={() => onDeleteDraft(index)}
                                className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

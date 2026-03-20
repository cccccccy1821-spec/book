import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Image as ImageIcon, Mic, MicOff, Loader2, Save, BookOpen, Hash, AlignLeft, Lightbulb } from 'lucide-react';
import { Book, Excerpt } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { runOCR } from '../utils/ocr';

interface AddExcerptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (excerpt: Omit<Excerpt, 'id' | 'createdAt'>, bookData: Partial<Book>) => void;
  onSaveDraft: (draft: Partial<Excerpt> & { bookTitle?: string }) => void;
  books: Book[];
  initialExcerpt?: Partial<Excerpt> & { bookTitle?: string };
}

export function AddExcerptModal({ isOpen, onClose, onSave, onSaveDraft, books, initialExcerpt }: AddExcerptModalProps) {
  const [text, setText] = useState(initialExcerpt?.text || '');
  const [thought, setThought] = useState(initialExcerpt?.thought || '');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [chapter, setChapter] = useState(initialExcerpt?.chapter || '');
  const [tags, setTags] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<string | undefined>(initialExcerpt?.originalImage);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeInput, setActiveInput] = useState<'text' | 'thought' | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (initialExcerpt) {
      if (initialExcerpt.bookTitle) {
        setBookTitle(initialExcerpt.bookTitle);
      } else if (initialExcerpt.bookId) {
        const book = books.find(b => b.id === initialExcerpt.bookId);
        if (book) {
          setBookTitle(book.title);
          setAuthor(book.author);
          setTags(book.tags.join(', '));
        }
      }
    }
  }, [initialExcerpt, books]);

  useEffect(() => {
    if (isListening && transcript) {
      if (activeInput === 'text') {
        setText(prev => prev + ' ' + transcript);
      } else if (activeInput === 'thought') {
        setThought(prev => prev + ' ' + transcript);
      }
      setTranscript(''); // Clear transcript after appending
    }
  }, [transcript, isListening, activeInput, setTranscript]);

  const handleClose = () => {
    if (text || thought || bookTitle) {
      if (window.confirm('有未保存的内容，是否保存到草稿箱？')) {
        onSaveDraft({
          text,
          thought,
          chapter,
          originalImage,
          bookTitle,
        });
      }
    }
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
      setIsExtracting(true);
      try {
        // 使用本地 Tesseract.js 进行 OCR 识别
        const extractedText = await runOCR(file);
        setText(prev => prev + (prev ? '\n\n' : '') + extractedText);
        
        // 满足用户要求：在 id 为 output 的元素中显示结果
        const outputEl = document.getElementById('output');
        if (outputEl) outputEl.textContent = extractedText;
      } catch (error) {
        alert('提取文字失败，请重试');
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!text.trim() || !bookTitle.trim()) {
      alert('书摘内容和书名不能为空');
      return;
    }

    const bookData: Partial<Book> = {
      title: bookTitle.trim(),
      author: author.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    const excerptData: Omit<Excerpt, 'id' | 'createdAt'> = {
      bookId: initialExcerpt?.bookId || '', // Will be handled by parent
      text: text.trim(),
      thought: thought.trim(),
      chapter: chapter.trim(),
      originalImage,
    };

    onSave(excerptData, bookData);
    onClose();
  };

  const toggleVoice = (inputField: 'text' | 'thought') => {
    if (isListening && activeInput === inputField) {
      stopListening();
      setActiveInput(null);
    } else {
      setActiveInput(inputField);
      startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={e => e.stopPropagation()}
          className="bg-white/80 backdrop-blur-xl w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(107,76,58,0.2)] border border-white/50 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/40 bg-white/30">
            <h2 className="text-xl font-bold text-[var(--theme-primary)] font-serif">
              {initialExcerpt ? '编辑书摘' : '添加书摘'}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <X className="w-6 h-6 text-[var(--theme-secondary)]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Image Upload Actions */}
            <div className="mb-2">
              {!showImageOptions ? (
                <button
                  onClick={() => setShowImageOptions(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-white/40 hover:bg-white/60 text-[var(--theme-camera-text)] rounded-2xl border border-white/50 transition-colors shadow-sm"
                >
                  <Camera className="w-6 h-6" />
                  <span className="font-medium text-lg">拍照 / 识图</span>
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => { cameraInputRef.current?.click(); setShowImageOptions(false); }}
                    className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-white/40 hover:bg-white/60 text-[var(--theme-camera-text)] rounded-2xl border border-white/50 transition-colors shadow-sm"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="font-medium">拍照识字</span>
                  </button>
                  <button
                    onClick={() => { fileInputRef.current?.click(); setShowImageOptions(false); }}
                    className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-[var(--theme-accent-light)]/20 hover:bg-[var(--theme-accent-light)]/40 text-[var(--theme-accent)] rounded-2xl border border-[var(--theme-accent-light)]/30 transition-colors shadow-sm"
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-medium">相册导入</span>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* OCR 结果展示区域 (满足用户要求) */}
            <pre id="output" className="hidden"></pre>

            {isExtracting && (
              <div className="flex items-center justify-center gap-3 p-4 bg-[var(--theme-bg-subtle)]/50 text-[var(--theme-secondary)] rounded-xl border border-[var(--theme-border)]/50">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">正在识别图片中的文字...</span>
              </div>
            )}

            {originalImage && (
              <div className="relative rounded-xl overflow-hidden border border-white/50 shadow-sm">
                <img src={originalImage} alt="Original" className="w-full h-32 object-cover" />
                <button
                  onClick={() => setOriginalImage(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-black/40 text-white rounded-full hover:bg-black/60 backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Book Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--theme-accent)]" /> 书名 *
                </label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                  placeholder="例如: 活着"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[var(--theme-accent)]" /> 作者
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                  placeholder="例如: 余华"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-[var(--theme-accent)]" /> 章节
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                  placeholder="例如: 第一章"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[var(--theme-accent)]" /> 标签
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full p-3 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                  placeholder="用逗号分隔, 如: 小说, 经典"
                />
              </div>
            </div>

            {/* Excerpt Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-[var(--theme-accent)]" /> 书摘内容 *
                </label>
                <button
                  onClick={() => toggleVoice('text')}
                  className={`p-2 rounded-full transition-colors ${
                    isListening && activeInput === 'text' ? 'bg-[var(--theme-accent-light)]/30 text-[var(--theme-accent)] animate-pulse border border-[var(--theme-accent-light)]' : 'bg-white/40 text-[var(--theme-secondary)] hover:bg-white/60 border border-white/50'
                  }`}
                >
                  {isListening && activeInput === 'text' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full h-40 p-4 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all resize-none font-serif leading-relaxed shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                placeholder="输入或识别书摘内容..."
              />
            </div>

            {/* Thought */}
            <div className="space-y-1.5 pb-20 sm:pb-0">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--theme-secondary)] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[var(--theme-accent)]" /> 想法
                </label>
                <button
                  onClick={() => toggleVoice('thought')}
                  className={`p-2 rounded-full transition-colors ${
                    isListening && activeInput === 'thought' ? 'bg-[var(--theme-accent-light)]/30 text-[var(--theme-accent)] animate-pulse border border-[var(--theme-accent-light)]' : 'bg-white/40 text-[var(--theme-secondary)] hover:bg-white/60 border border-white/50'
                  }`}
                >
                  {isListening && activeInput === 'thought' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>
              <textarea
                value={thought}
                onChange={e => setThought(e.target.value)}
                className="w-full h-24 p-4 bg-white/50 border border-white/60 rounded-xl focus:ring-2 focus:ring-[var(--theme-accent-light)] focus:border-transparent transition-all resize-none leading-relaxed shadow-inner text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/50"
                placeholder="写下你对这段文字的想法..."
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-white/40 bg-white/30 flex gap-3">
            <button
              onClick={() => {
                onSaveDraft?.({
                  text,
                  thought,
                  bookTitle,
                  chapter,
                  originalImage,
                });
                onClose();
              }}
              className="flex-1 py-4 bg-white/50 hover:bg-white/70 text-[var(--theme-primary)] rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 border border-white/60"
            >
              <Save className="w-5 h-5 opacity-70" />
              保存草稿
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] py-4 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white rounded-2xl font-bold text-lg shadow-[0_4px_14px_0_rgba(194,123,160,0.39)] transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <Save className="w-5 h-5" />
              保存书摘
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

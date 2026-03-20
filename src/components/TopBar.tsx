import { LayoutList, FolderArchive, Library, Search, Settings } from 'lucide-react';
import { ViewMode } from '../types';

interface TopBarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
}

export function TopBar({ currentView, onViewChange, searchQuery, onSearchChange, onOpenSettings }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-[0_4px_30px_rgba(107,76,58,0.05)] sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xs gap-3">
        <button
          onClick={onOpenSettings}
          className="p-2 bg-white/40 hover:bg-white/60 text-[var(--theme-secondary)] hover:text-[var(--theme-accent)] rounded-full border border-white/50 transition-colors shadow-sm shrink-0"
          title="设置"
        >
          <Settings className="w-4 h-4" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索书摘、想法或书名..."
            className="w-full pl-9 pr-4 py-1.5 bg-white/40 border border-white/50 rounded-full text-sm text-[var(--theme-primary)] placeholder-[var(--theme-secondary)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-light)] transition-all shadow-inner"
          />
        </div>
      </div>
      
      <div className="flex bg-white/40 p-1 rounded-full border border-white/50 shadow-inner ml-4">
        <button
          onClick={() => onViewChange('feed')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentView === 'feed' ? 'bg-[var(--theme-accent-light)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:text-[var(--theme-primary)]'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span className="hidden sm:inline">博文</span>
        </button>
        <button
          onClick={() => onViewChange('archive')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentView === 'archive' ? 'bg-[var(--theme-accent-light)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:text-[var(--theme-primary)]'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span className="hidden sm:inline">档案</span>
        </button>
        <button
          onClick={() => onViewChange('bookshelf')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            currentView === 'bookshelf' ? 'bg-[var(--theme-accent-light)] shadow-sm text-white' : 'text-[var(--theme-secondary)] hover:text-[var(--theme-primary)]'
          }`}
        >
          <Library className="w-4 h-4" />
          <span className="hidden sm:inline">书架</span>
        </button>
      </div>
    </div>
  );
}

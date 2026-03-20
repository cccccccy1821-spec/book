export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  overallReview?: string;
  tags: string[];
  createdAt: number;
}

export interface Excerpt {
  id: string;
  bookId: string;
  text: string;
  thought?: string;
  originalImage?: string;
  chapter?: string;
  createdAt: number;
}

export type ViewMode = 'feed' | 'archive' | 'bookshelf';

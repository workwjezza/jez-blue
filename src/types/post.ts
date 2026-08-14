export interface Post {
  id: string;
  code: string; // e.g., "jb-001", "jb-002"
  title: string;
  content?: string; // markdown supported
  media: { src: string; alt: string }[]; // 1 or more images
  status: 'published' | 'draft';
  tags?: string[];
  createdAt: string;
}

export type PostCategory = 'new' | 'text' | 'media' | 'links';

export interface Post {
  id: string;
  number: number; // automatic chronological number: 0, 1, 2, 3, etc.
  title: string;
  content?: string; // markdown supported
  media?: { src: string; alt: string }[]; // 1 or more images (optional for text posts)
  postType?: 'media' | 'text' | 'link'; // type of post
  textSize?: 'small' | 'medium' | 'large'; // for text posts
  status: 'published' | 'draft';
  createdAt: string;
}

export type PostCategory = 'new' | 'text' | 'media' | 'links';

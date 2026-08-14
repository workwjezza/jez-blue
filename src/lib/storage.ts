import type { Post } from '@/types/post';

const STORAGE_KEY = 'jez-blue-posts';

export const storage = {
  getPosts: (): Post[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePosts: (posts: Post[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Failed to save posts:', error);
    }
  },

  getPost: (id: string): Post | undefined => {
    return storage.getPosts().find(post => post.id === id);
  },

  renumberPublishedPosts: (posts: Post[]): Post[] => {
    // Get all published posts sorted by createdAt
    const publishedPosts = posts
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Renumber them sequentially starting from 0
    publishedPosts.forEach((post, index) => {
      post.number = index;
    });
    
    return posts;
  },

  getNextPostNumber: (): number => {
    const posts = storage.getPosts();
    const publishedPosts = posts.filter(p => p.status === 'published');
    if (publishedPosts.length === 0) return 0;
    const maxNumber = Math.max(...publishedPosts.map(p => p.number));
    return maxNumber + 1;
  },

  addPost: (post: Post): void => {
    const posts = storage.getPosts();
    posts.push(post);
    const renumbered = storage.renumberPublishedPosts(posts);
    storage.savePosts(renumbered);
  },

  updatePost: (id: string, updates: Partial<Post>): void => {
    const posts = storage.getPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
      const oldStatus = posts[index].status;
      posts[index] = { ...posts[index], ...updates };
      
      // If status changed, renumber
      if (updates.status && updates.status !== oldStatus) {
        const renumbered = storage.renumberPublishedPosts(posts);
        storage.savePosts(renumbered);
      } else {
        storage.savePosts(posts);
      }
    }
  },

  deletePost: (id: string): void => {
    const posts = storage.getPosts().filter(post => post.id !== id);
    const renumbered = storage.renumberPublishedPosts(posts);
    storage.savePosts(renumbered);
  },

  initializeMockData: (): void => {
    const existing = storage.getPosts();
    if (existing.length > 0) return;

    const mockPosts: Post[] = [
      {
        id: '1',
        number: 0,
        title: 'first post',
        content: 'this is the first post on jez.blue. a brutalist micro-blog for sharing thoughts, media, and links.',
        media: [
          { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop', alt: '000 image 1' }
        ],
        status: 'published',
        createdAt: new Date('2026-08-01').toISOString(),
      },
      {
        id: '2',
        number: 1,
        title: 'brutalist design',
        content: 'embracing raw materials and honest construction. no decoration, just pure form and function.',
        media: [
          { src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=800&fit=crop', alt: '001 image 1' },
          { src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&h=800&fit=crop', alt: '001 image 2' }
        ],
        status: 'published',
        createdAt: new Date('2026-08-05').toISOString(),
      },
      {
        id: '3',
        number: 2,
        title: 'typography matters',
        content: 'tight letter-spacing, all lowercase, grotesque sans-serif. let the type do the work.',
        media: [
          { src: 'https://images.unsplash.com/photo-1461958508236-9a742665a0d5?w=800&h=800&fit=crop', alt: '002 image 1' }
        ],
        status: 'published',
        createdAt: new Date('2026-08-08').toISOString(),
      },
      {
        id: '4',
        number: 3,
        title: 'useful links',
        content: 'https://brutalistwebsites.com\nhttps://www.are.na\nhttps://www.ffffound.com',
        media: [
          { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=800&fit=crop', alt: '003 image 1' }
        ],
        postType: 'link',
        status: 'published',
        createdAt: new Date('2026-08-10').toISOString(),
      },
      {
        id: '5',
        number: 4,
        title: 'black and white',
        content: 'pure contrast. no gradients, no shadows, no rounded corners.',
        media: [
          { src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop', alt: '004 image 1' }
        ],
        status: 'published',
        createdAt: new Date('2026-08-12').toISOString(),
      },
      {
        id: '6',
        number: 5,
        title: 'grid systems',
        content: 'tight gutters, precise alignment, mathematical order.',
        media: [
          { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=800&fit=crop', alt: '005 image 1' }
        ],
        status: 'published',
        createdAt: new Date('2026-08-13').toISOString(),
      },
    ];

    storage.savePosts(mockPosts);
  },

  formatPostNumber: (num: number): string => {
    return num.toString().padStart(3, '0');
  },
};

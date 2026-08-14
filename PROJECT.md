# jez.blue - Brutalist Micro-Blog

A mobile-first micro-blog with a brutalist editorial aesthetic. Built with Next.js 16.3.0, React 19, and Tailwind v4.

## Design System

- **Pure brutalist aesthetic**: White (#FFFFFF) background, black (#000000) text only
- **Typography**: All-lowercase by default, tight letter-spacing (-0.07em on headings)
- **Zero decoration**: No shadows, no rounded corners, minimal 1px black borders
- **Single-column layout**: Mobile-first with centered narrow column on desktop (max-width 640px)

## Features

### Feed View (`/`)
- 3-column grid of posts with tight 1px black gutters
- Category filter: all, new, text, media, links
- Each post shows thumbnail + post code (jb-001, jb-002, etc.)
- Click post to view details

### Post Detail View (`/post/[id]`)
- Large media area with horizontal swipe navigation for multiple images
- Dot pagination (● ○ ○) for media carousel
- Post code, title, and save button (+)
- Expandable "information" section with content, date, and tags

### Admin Interface (`/admin`)
- Grid view of all posts with draft/published status
- Create new posts with "+" button
- Edit existing posts
- Toggle publish/draft status
- Delete posts
- Simple localStorage-based persistence (no backend needed)

## Data Structure

```typescript
interface Post {
  id: string;
  code: string; // e.g., "jb-001", "jb-002"
  title: string;
  content?: string;
  media: { src: string; alt: string }[];
  status: 'published' | 'draft';
  tags?: string[];
  createdAt: string;
}
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── edit/[id]/page.tsx  # Edit post page
│   │   ├── new/page.tsx        # Create new post page
│   │   └── page.tsx            # Admin dashboard
│   ├── post/[id]/page.tsx      # Post detail view
│   ├── globals.css             # Global brutalist styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Feed view (home)
├── components/
│   ├── CategoryFilter.tsx      # Category filter bar
│   ├── Header.tsx              # Fixed header with navigation
│   ├── InformationSection.tsx  # Expandable info section
│   ├── PostGrid.tsx            # 3-column post grid
│   └── SwipeableMedia.tsx      # Swipeable media carousel
├── lib/
│   └── storage.ts              # localStorage utilities
└── types/
    └── post.ts                 # TypeScript interfaces
```

## Interactions

- **Swipe**: Horizontal swipe on post detail to navigate between media (50px threshold)
- **Tap to expand**: "information" section expands/collapses with smooth transition
- **Hover states**: Subtle opacity changes on interactive elements
- **Category filter**: Click to filter posts by category

## Mock Data

The app initializes with 6 sample posts on first load, stored in localStorage. Data persists across sessions.

## Technical Notes

- Mobile-first responsive design (tested at ~390px width)
- All text is lowercase by default (CSS text-transform)
- Uses Next.js App Router with client-side components
- No external dependencies beyond Next.js, React, and Tailwind
- localStorage-based persistence (no backend required)

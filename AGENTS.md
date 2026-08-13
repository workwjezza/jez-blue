<!-- BEGIN:nextjs-agent-rules -->

# Agent instructions

## Project
jez.blue — a mobile-first micro-blog: hybrid of blog, media poster, and link-sharing feed. Single-column layout on all viewports; desktop is a centered narrow column, not a multi-column layout.

## Design language
- Brutalist editorial aesthetic
- All-lowercase text by default
- Tight letter-spacing on headings (-0.07em range)
- Inter or similar grotesque typeface
- Minimal color; type and spacing do the work

## General rules
- Read relevant code before editing it.
- Make small, focused changes.
- Do not add dependencies without asking.
- Do not commit, push, or deploy without approval.
- Never commit secrets or .env files.
- Run `npm run build` after substantive changes to verify nothing broke.

## Commands
- Install: `npm install`
- Development: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`

## Git workflow
- Feature branches for all changes; never commit directly to main.
- Show `git diff` before committing.
- Clear commit messages, lowercase, imperative mood.

## Definition of done
- `npm run build` passes.
- `npm run lint` passes.
- Layout works at mobile width (~390px) and as a single centered column on desktop.

<!-- END:nextjs-agent-rules -->

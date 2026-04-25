# DevDocs Codebase Deep Dive

## Architecture Overview
The DevDocs application is an Angular 21 application functioning as a documentation explorer. It fetches a raw Markdown README from a GitHub repository, parses it into a hierarchical tree based on Markdown headings (H1, H2, H3), and displays it in a responsive 3-column layout (Sidebar, Main Content, Table of Contents).

### Core Technologies
- **Framework**: Angular 21 (Standalone Components)
- **Styling**: SCSS (Custom Brand & Typography), Tailwind CSS is *not* used.
- **Markdown Parsing**: `ngx-markdown`, `highlight.js`, `marked`.
- **State Management**: RxJS (`BehaviorSubject`, `Observable`).

---

## Directory Structure

```text
src/
├── app/
│   ├── core/         # Singleton services and data models
│   ├── features/     # Feature modules (DocViewer, Sidebar, TOC, Favorites)
│   ├── layout/       # Shell layout components
│   └── shared/       # Shared UI components and pipes
├── environments/     # Environment configurations (GitHub tokens, etc.)
└── styles/           # Global SCSS variables and typography
```

---

## Core Services (`core/services`)

### `github.service.ts`
Responsible for interacting with the GitHub API.
- **Key Method**: `getReadme()`
- **Functionality**: Fetches the raw `readme` from the configured GitHub repository. Uses an authorization token if available (to increase rate limits) and utilizes `shareReplay(1)` to cache the request during the session.

### `docs-parser.service.ts`
Converts raw Markdown strings into an array of `DocSection` objects.
- **Key Method**: `parse(markdown: string): DocSection[]`
- **Functionality**: Iterates through the markdown line-by-line. When a heading (`#`, `##`, `###`) is encountered, it creates a new `DocSection` and flushes any buffered content to the previous active heading. It nests H2s under H1s, and H3s under H2s. It also generates URL-safe IDs using a `slugify` method.

### `docs-state.service.ts`
Acts as the central state store for the parsed documentation.
- **State**: `sectionsSubject = new BehaviorSubject<DocSection[]>([])`
- **Functionality**: Exposes `sections$` observable. The `loadReadme()` method triggers the `GithubService` fetch and passes the result to the `DocsParserService`. It also provides a `getSectionById(id)` method which recursively searches the nested tree to find a specific section.

### `theme.service.ts`
Handles dark/light mode toggling.
- **Functionality**: Uses an Angular `signal(false)` for `isDark`. It toggles a `dark-theme` CSS class on `document.body` and persists the user's choice in `localStorage`.

### `copy-code.service.ts`
A utility service for injecting "Copy" buttons into rendered Markdown code blocks.
- **Functionality**: Searches the DOM for `pre code` elements and appends a dynamically created `<button class="copy-btn">`. Clicking the button writes the block's text to the clipboard using `navigator.clipboard.writeText`.

### `favorites.service.ts`
Manages the user's saved sections.
- **State**: `favorites$ = new BehaviorSubject<Favorite[]>(...)`
- **Functionality**: Loads from and saves to `localStorage` under the key `devdocs_favorites`. Provides `toggle()` to add or remove a section from favorites, and `isFavorite()` to check if a section is saved.

### `toc.service.ts`
Generates the Table of Contents dynamically from the rendered DOM.
- **State**: `items$ = new BehaviorSubject<TocItem[]>([])`
- **Functionality**: Uses `document.querySelectorAll` to find `h2` and `h3` tags inside the `.doc-content` wrapper. Extracts their IDs and text content to build a flat list of `TocItem`s.

---

## Feature Components (`features/`)

### `sidebar.component.ts`
Renders the navigation tree.
- **State**: Maintains an `expandedSections` Set to track which nodes in the tree are expanded.
- **Filtering**: Combines the full `sections$` tree with the `SidebarFilterService`'s search term. The `filterTree` method creates a new tree containing only nodes (and their parents) that match the search term.
- **Navigation**: Uses `Router` to navigate to `/docs/section/:id`.

### `doc-viewer.component.ts`
The primary content display area.
- **Routing**: Listens to `ActivatedRoute.paramMap` to get the `sectionId` from the URL, then fetches the corresponding section from `DocsStateService`.
- **Markdown Rendering**: Uses `<markdown>` (from `ngx-markdown`) to render `section.content`.
- **Post-Render Lifecycle**: In the `onMarkdownReady()` callback (triggered after markdown parsing), it calls `copyCodeService.attachButtons()` and `tocService.buildFromDOM()`.

### `toc.component.ts`
Displays the Table of Contents on the right side of the screen.
- **Navigation**: Implements smooth scrolling to specific headings. It intelligently locates the `.panel--center` scroll container to calculate accurate scroll offsets, providing a "breathing room" offset of 24px.

### `favorites.component.ts`
Displays a simple list of the user's bookmarked sections, routing to them when clicked.

---

## Layout (`layout/shell.component.ts`)

The `ShellComponent` is the persistent layout wrapper.
- **Initialization**: On `ngOnInit`, it calls `themeService.init()` and `docsState.loadReadme()`.
- **Responsive Behavior**: Manages a mobile menu state (`isMobileMenuOpen`). It subscribes to Router `NavigationEnd` events to automatically close the mobile menu when the user navigates to a new page.

## Routing (`app.routes.ts`)
1. **`/docs`**: The main route attached to `ShellComponent`.
2. **`/docs/section/:sectionId`**: Child route mapping to `DocViewerComponent`.
3. **`/docs/favorites`**: Child route mapping to `FavoritesComponent`.
4. **Default**: Redirects to `/docs/section/introduction`.

---

## Notable Architectural Decisions
1. **Separation of Concerns**: Highly modular service architecture. DOM manipulation (TOC and Copy buttons) is strictly contained in utility services invoked only after `ngx-markdown` finishes rendering.
2. **Reactive State**: Heavy usage of RxJS `BehaviorSubject` for state propagation (Docs, Favorites, TOC, Search Filter) ensures UI components update automatically when underlying data changes.
3. **DOM-based TOC**: Rather than attempting to parse headings from the Markdown AST for the TOC, the app waits for Angular to render the Markdown, then parses the DOM for `h2` and `h3` tags. This simplifies logic and ensures 1:1 mapping with the visual content.

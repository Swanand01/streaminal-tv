# Streaminal TV

A modern streaming platform built with Next.js that aggregates content from The Movie Database (TMDB) and multiple video sources.

## Screenshots

### Home
![Home](docs/images/home.png)

### Movies
![Movies](docs/images/movies.png)

### TV Show
![TV Show](docs/images/tv-show.png)

## Getting Started

### Prerequisites

- Node.js 18+
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Configuration

### Video Sources

Edit `config/sources.json` to update streaming sources when URLs change:

```json
{
  "movie": [{ "name": "Server 1", "url": "https://..." }],
  "tv": [{ "name": "Server 1", "url": "https://..." }]
}
```

Use `{id}`, `{season}`, `{episode}` placeholders in URLs.

## Project Structure

```
app/                    # Next.js pages (App Router)
  ├── movies/          # Movie browse & detail pages
  ├── tv-shows/        # TV show browse & detail pages
  ├── search/          # Search results
  └── people/          # Actor/crew profiles

components/            # React components
  ├── ui/             # shadcn components
  ├── media/          # Media cards & carousels
  └── ...

lib/                   # Utilities & API client
  ├── tmdb.ts         # TMDB API functions
  └── utils.ts        # Helpers

config/                # Configuration files
  └── sources.json    # Video source URLs
```

## Tech Stack

- **Next.js 16** (App Router)
- **TanStack React Query** for data fetching
- **shadcn/ui** components
- **TMDB API** for movie/TV metadata

## License

MIT

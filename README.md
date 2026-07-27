# Symbolradar

An editorial content feed for Matthieu Pageau, Jonathan Pageau,
Jean-Philippe Marceau, and The Symbolic World.

## Sources

- YouTube channel feeds for Jonathan Pageau and Jean-Philippe Marceau
- Matthieu Pageau's Substack feed
- Google News RSS for broader mentions
- Official embedded X profile timelines
- Optional YouTube Data API discovery of guest appearances

Sources are cached for one hour. Full articles and videos are not copied; the
site displays metadata, short excerpts, and links to the original sources.

## Optional YouTube key

Copy `.env.example` to `.env` for local use and set `YOUTUBE_API_KEY`.
In production, store the key as a secret environment value on the hosting
platform. Never commit it to source control.

## Development

```text
npm install
npm run dev
```

## Checks and build

```text
npm run build
```

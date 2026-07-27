# Symbolradar

En norsk, redaksjonell innholdsstrøm for Matthieu Pageau, Jonathan Pageau,
Jean-Philippe Marceau og The Symbolic World.

## Kilder

- YouTube-kanalfeeder for Jonathan Pageau og Jean-Philippe Marceau
- Matthieu Pageaus Substack-feed
- Google News RSS for bredere omtaler
- Offisielle X-profiltidslinjer
- Valgfritt YouTube Data API-søk etter gjesteopptredener

Kildene mellomlagres i én time. Hele artikler eller videoinnhold kopieres ikke;
siden viser metadata, korte utdrag og lenker til originalkildene.

## Valgfri YouTube-nøkkel

Kopier `.env.example` til `.env` for lokal bruk og sett `YOUTUBE_API_KEY`.
I produksjon skal nøkkelen legges inn som en skjult miljøverdi hos
publiseringsplattformen. Den skal aldri ligge i kildekoden.

## Utvikling

```text
npm install
npm run dev
```

## Kontroll og bygg

```text
npm run build
```

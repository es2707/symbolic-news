"use client";

import { useMemo, useState } from "react";
import type { FeedItem, FeedSource } from "../lib/feed";

type Filter = "all" | FeedSource;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Alt" },
  { value: "youtube", label: "YouTube" },
  { value: "substack", label: "Essays" },
  { value: "mention", label: "Omtaler" },
];

export function FeedExplorer({
  items,
  warnings,
}: {
  items: FeedItem[];
  warnings: string[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("nb-NO");
    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.source === filter;
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.author} ${item.description}`
          .toLocaleLowerCase("nb-NO")
          .includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, items, query]);

  function chooseFilter(value: Filter) {
    setFilter(value);
    setVisibleCount(9);
  }

  return (
    <div>
      <div className="feed-controls">
        <div className="filters" aria-label="Filtrer innhold">
          {filters.map((item) => (
            <button
              aria-pressed={filter === item.value}
              className={filter === item.value ? "active" : ""}
              key={item.value}
              onClick={() => chooseFilter(item.value)}
              type="button"
            >
              {item.label}
              <span>
                {item.value === "all"
                  ? items.length
                  : items.filter((entry) => entry.source === item.value).length}
              </span>
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Søk i strømmen</span>
          <input
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(9);
            }}
            placeholder="Søk etter tema eller navn"
            type="search"
            value={query}
          />
          <b aria-hidden="true">⌕</b>
        </label>
      </div>

      {warnings.length > 0 && items.length > 0 ? (
        <p className="feed-warning">
          Noen kilder svarte ikke akkurat nå. Resten av strømmen er oppdatert.
        </p>
      ) : null}

      {filtered.length > 0 ? (
        <>
          <div className="feed-grid">
            {filtered.slice(0, visibleCount).map((item, index) => (
              <FeedCard item={item} featured={index === 0 && filter === "all"} key={item.id} />
            ))}
          </div>
          {visibleCount < filtered.length ? (
            <button
              className="load-more"
              onClick={() => setVisibleCount((count) => count + 9)}
              type="button"
            >
              Vis flere signaler <span aria-hidden="true">↓</span>
            </button>
          ) : null}
        </>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">◎</span>
          <h3>Ingen treff akkurat her</h3>
          <p>Prøv et annet søkeord eller velg «Alt».</p>
        </div>
      )}
    </div>
  );
}

function FeedCard({ item, featured }: { item: FeedItem; featured: boolean }) {
  return (
    <article className={`feed-card ${featured ? "featured" : ""}`}>
      <a href={item.url} target="_blank" rel="noreferrer" aria-label={`${item.title}, åpne originalkilden`}>
        <div className="card-media">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" loading="lazy" />
          ) : (
            <div className={`media-fallback ${item.source}`}>
              <span>{item.source === "mention" ? "✦" : item.label.slice(0, 1)}</span>
              <i />
            </div>
          )}
          <span className={`source-badge ${item.source}`}>{item.label}</span>
        </div>
        <div className="card-body">
          <p className="card-meta">
            <span>{item.author}</span>
            <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
          </p>
          <h3>{item.title}</h3>
          <p className="card-description">{item.description || "Åpne originalkilden for å se mer."}</p>
          <span className="card-link">
            Gå til originalen <b aria-hidden="true">↗</b>
          </span>
        </div>
      </a>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

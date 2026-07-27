"use client";

import { useMemo, useState } from "react";
import type { FeedItem, FeedSource } from "../lib/feed";

type Filter = "all" | FeedSource;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "youtube", label: "YouTube" },
  { value: "substack", label: "Essays" },
  { value: "mention", label: "Discoveries" },
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
    const normalized = query.trim().toLocaleLowerCase("en");
    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.source === filter;
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.author} ${item.description}`
          .toLocaleLowerCase("en")
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
        <div className="filters" aria-label="Filter content">
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
          <span className="sr-only">Search the feed</span>
          <input
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(9);
            }}
            placeholder="Search by topic or name"
            type="search"
            value={query}
          />
          <b aria-hidden="true">⌕</b>
        </label>
      </div>

      {warnings.length > 0 && items.length > 0 ? (
        <p className="feed-warning">
          Some sources are temporarily unavailable. The rest of the feed is up
          to date.
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
              Show more signals <span aria-hidden="true">↓</span>
            </button>
          ) : null}
        </>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">◎</span>
          <h3>No results here</h3>
          <p>Try another search term or choose “All”.</p>
        </div>
      )}
    </div>
  );
}

function FeedCard({ item, featured }: { item: FeedItem; featured: boolean }) {
  return (
    <article className={`feed-card ${featured ? "featured" : ""}`}>
      <a href={item.url} target="_blank" rel="noreferrer" aria-label={`${item.title}, open the original source`}>
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
          <p className="card-description">{item.description || "Open the original source to learn more."}</p>
          <span className="card-link">
            View original <b aria-hidden="true">↗</b>
          </span>
        </div>
      </a>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

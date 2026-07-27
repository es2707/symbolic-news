"use client";

import { useState } from "react";
import type { FeedItem } from "../lib/feed";

export function ContentList({
  items,
  initialCount = 5,
  pageSize = 5,
  archive = false,
}: {
  items: FeedItem[];
  initialCount?: number;
  pageSize?: number;
  archive?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleItems = items.slice(0, visibleCount);
  const remaining = Math.max(0, items.length - visibleCount);

  return (
    <>
      <div className={archive ? "archive-list" : "stream-list"}>
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => <ContentCard item={item} key={item.id} />)
        ) : (
          <p className="empty-state">No current items are available.</p>
        )}
      </div>
      {remaining > 0 && (
        <button
          className="load-more"
          onClick={() =>
            setVisibleCount((current) =>
              Math.min(current + pageSize, items.length),
            )
          }
          type="button"
        >
          Load older results
          <span>{remaining} remaining</span>
        </button>
      )}
    </>
  );
}

function ContentCard({ item }: { item: FeedItem }) {
  return (
    <article className={`stream-card ${item.kind}`}>
      <a href={item.url} rel="noreferrer" target="_blank">
        {item.imageUrl && (
          <div className="card-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" loading="lazy" src={item.imageUrl} />
          </div>
        )}
        <div className="card-content">
          <p className="card-meta">
            <span>{item.label}</span>
            <time dateTime={item.publishedAt}>
              {formatDate(item.publishedAt)}
            </time>
          </p>
          <h3>{item.title}</h3>
          <p className="card-description">{item.description}</p>
          <p className="card-byline">
            <span>{item.author}</span>
            <b aria-hidden="true">↗</b>
          </p>
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
    timeZone: "Europe/Oslo",
  }).format(new Date(value));
}

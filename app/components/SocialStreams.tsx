import Script from "next/script";
import { siteConfig } from "../config";

export function SocialStreams({
  personSlug,
  expanded = false,
}: {
  personSlug?: string;
  expanded?: boolean;
}) {
  const socialProfiles = siteConfig.socialProfiles.filter(
    (profile) => !personSlug || profile.personSlug === personSlug,
  );
  const xProfiles = siteConfig.xProfiles.filter(
    (profile) => !personSlug || profile.personSlug === personSlug,
  );

  if (socialProfiles.length === 0 && xProfiles.length === 0) {
    return (
      <p className="empty-state">
        No verified social profiles are currently configured.
      </p>
    );
  }

  return (
    <>
      {socialProfiles.length > 0 && (
        <div className="social-links" aria-label="Official social profiles">
          {socialProfiles.map((profile) => (
            <a
              href={profile.url}
              key={`${profile.network}:${profile.name}`}
              rel="noreferrer"
              target="_blank"
            >
              <span>{profile.network}</span>
              <strong>{profile.name}</strong>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
      )}

      {xProfiles.length > 0 && (
        <div className={`x-timelines ${expanded ? "expanded" : ""}`}>
          {xProfiles.map((profile) => (
            <article className="x-card" key={profile.handle}>
              <header>
                <div>
                  <span>X</span>
                  <strong>@{profile.handle}</strong>
                </div>
                <a href={profile.url} rel="noreferrer" target="_blank">
                  Open ↗
                </a>
              </header>
              <a
                className="twitter-timeline"
                data-chrome="noheader nofooter noborders transparent"
                data-height={expanded ? "760" : "430"}
                data-theme="light"
                href={profile.url}
              >
                Latest posts from @{profile.handle}
              </a>
            </article>
          ))}
        </div>
      )}

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </>
  );
}

import Script from "next/script";
import { FeedExplorer } from "./components/FeedExplorer";
import { siteConfig } from "./config";
import { loadFeed } from "./lib/feed";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, generatedAt, warnings } = await loadFeed();

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Symbolradar, til toppen">
          <span className="brand-mark" aria-hidden="true">
            <i />
          </span>
          <span>Symbolradar</span>
        </a>
        <nav aria-label="Hovedmeny">
          <a href="#strom">Strøm</a>
          <a href="#oppdag">Oppdag</a>
          <a href="#x">X</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">Et levende arkiv over symbolsk tenkning</p>
          <h1>
            Følg mønsteret
            <span>mens det utfolder seg.</span>
          </h1>
          <p className="hero-intro">
            Nye videoer, essays, samtaler og omtaler rundt Matthieu Pageau,
            Jonathan Pageau og Jean-Philippe Marceau — samlet på ett sted.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#strom">
              Se siste nytt <span aria-hidden="true">↓</span>
            </a>
            <span className="updated">
              <i aria-hidden="true" />
              Oppdatert {formatUpdated(generatedAt)}
            </span>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orbit-center">
            <span>α</span>
            <i />
            <span>ω</span>
          </div>
          <p>språk · mønster · skapelse</p>
        </div>
      </section>

      <section className="people-strip" aria-label="Personer som følges">
        {siteConfig.people.map((person, index) => (
          <a href={person.primaryUrl} target="_blank" rel="noreferrer" key={person.name}>
            <span>0{index + 1}</span>
            <strong>{person.name}</strong>
            <small>{person.role}</small>
            <b aria-hidden="true">↗</b>
          </a>
        ))}
      </section>

      <section className="feed-section" id="strom">
        <div className="section-heading">
          <div>
            <p className="kicker">Siste signaler</p>
            <h2>Den løpende strømmen</h2>
          </div>
          <p>
            Offisielle kilder og bredere omtaler, sortert med det nyeste først.
            Kildene sjekkes automatisk.
          </p>
        </div>
        <FeedExplorer items={items} warnings={warnings} />
      </section>

      <section className="discovery-section" id="oppdag">
        <div className="discovery-copy">
          <p className="kicker">Utenfor de faste kanalene</p>
          <h2>Oppdag gjesteopptredener</h2>
          <p>
            Åpne ferdige, levende søk etter podkaster, intervjuer og omtaler på
            YouTube og X. Dette gjør det mulig å finne nye kanaler uten
            skraping eller en betalt datatjeneste.
          </p>
        </div>
        <div className="discovery-grid">
          {siteConfig.people.map((person) => (
            <article className="discovery-card" key={person.name}>
              <p>{person.monogram}</p>
              <h3>{person.name}</h3>
              <span>podcast · interview · guest</span>
              <div>
                <a href={person.youtubeSearch} target="_blank" rel="noreferrer">
                  Søk på YouTube <b aria-hidden="true">↗</b>
                </a>
                <a href={person.xSearch} target="_blank" rel="noreferrer">
                  Søk på X <b aria-hidden="true">↗</b>
                </a>
              </div>
            </article>
          ))}
        </div>
        <aside className="api-note">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Vil du ha alle YouTube-treffene direkte i strømmen?</strong>
            <p>
              En gratis YouTube API-nøkkel kan legges til senere. Siden er
              allerede klargjort for dette, uten at nøkkelen blir synlig for
              besøkende.
            </p>
          </div>
        </aside>
      </section>

      <section className="x-section" id="x">
        <div className="section-heading light">
          <div>
            <p className="kicker">Direkte fra X</p>
            <h2>De nyeste innleggene</h2>
          </div>
          <p>
            Offisielle, innebygde profiltidslinjer. X kan sette
            informasjonskapsler når disse lastes.
          </p>
        </div>
        <div className="x-grid">
          {siteConfig.xProfiles.map((profile) => (
            <article className="x-card" key={profile.handle}>
              <header>
                <div>
                  <span>@</span>
                  <strong>{profile.name}</strong>
                </div>
                <a href={profile.url} target="_blank" rel="noreferrer">
                  Åpne på X ↗
                </a>
              </header>
              <a
                className="twitter-timeline"
                data-chrome="noheader nofooter noborders transparent"
                data-height="520"
                data-theme="light"
                href={profile.url}
              >
                Innlegg fra @{profile.handle}
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <i />
          </span>
          <span>Symbolradar</span>
        </a>
        <p>
          Viser metadata og korte utdrag. Alt innhold tilhører
          originalutgiverne.
        </p>
        <div>
          <a href="https://www.thesymbolicworld.com/" target="_blank" rel="noreferrer">
            The Symbolic World
          </a>
          <a href="#top">Til toppen ↑</a>
        </div>
      </footer>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
    </main>
  );
}

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  }).format(new Date(value));
}

export const siteConfig = {
  name: "Symbolic Search",
  youtubeChannels: [
    {
      name: "Jonathan Pageau",
      channelId: "UCObI9A-XPP3KD3Fc3MnzOuw",
      personSlug: "jonathan-pageau",
    },
    {
      name: "Jean-Philippe Marceau",
      channelId: "UCZzlvx0HHYiPOJTEOU399WA",
      personSlug: "jean-philippe-marceau",
    },
  ],
  substackFeeds: [
    {
      name: "Matthieu Pageau",
      url: "https://matthieupageau.substack.com/feed",
      personSlug: "matthieu-pageau",
    },
  ],
  people: [
    {
      name: "Matthieu Pageau",
      slug: "matthieu-pageau",
      description: "Videos, essays and official profiles associated with Matthieu Pageau.",
    },
    {
      name: "Jonathan Pageau",
      slug: "jonathan-pageau",
      description: "Videos, essays and official profiles associated with Jonathan Pageau.",
    },
    {
      name: "Jean-Philippe Marceau",
      slug: "jean-philippe-marceau",
      description:
        "Videos, essays and official sources associated with Jean-Philippe Marceau.",
    },
  ],
  officialArticles: [
    {
      title: "The Chiastic Structure of the Rosary",
      description:
        "The Rosary follows a chiastic structure at several levels: the Hail Mary, its mysteries, and the week.",
      url: "https://www.thesymbolicworld.com/content/the-chiastic-structure-of-the-rosary",
      author: "Jean-Philippe Marceau",
      publishedAt: "2026-06-17T00:00:00.000Z",
      personSlugs: ["jean-philippe-marceau"],
    },
    {
      title:
        "Hazarding to Turn a Mirror to the Beauty of Snow White and the Widow Queen",
      description:
        "An essay on beauty, chaos, and the symbolic framing of Jonathan Pageau's Snow White and the Widow Queen.",
      url: "https://www.thesymbolicworld.com/content/hazarding-to-turn-a-mirror-to-the-beauty-of-snow-white-and-the-widow-queen",
      author: "Cormac Jones",
      publishedAt: "2026-05-19T00:00:00.000Z",
      personSlugs: ["jonathan-pageau"],
    },
    {
      title: "Rome Cut Off, Israel Regrafted",
      description:
        "Romans 11, Cain and Abel, technology, and the demographic questions facing industrial societies.",
      url: "https://www.thesymbolicworld.com/content/rome-cut-off-israel-regrafted",
      author: "Jean-Philippe Marceau",
      publishedAt: "2026-05-11T00:00:00.000Z",
      personSlugs: ["jean-philippe-marceau"],
    },
  ],
  articleIndexUrl:
    "https://www.thesymbolicworld.com/content-categories/articles",
  xProfiles: [
    {
      name: "Jonathan Pageau",
      handle: "PageauJonathan",
      url: "https://x.com/PageauJonathan",
      personSlug: "jonathan-pageau",
    },
    {
      name: "Matthieu Pageau",
      handle: "PageauMatthieu",
      url: "https://x.com/PageauMatthieu",
      personSlug: "matthieu-pageau",
    },
  ],
  socialProfiles: [
    {
      network: "Instagram",
      name: "Jonathan Pageau",
      url: "https://www.instagram.com/jonathan.pageau/?hl=en",
      personSlug: "jonathan-pageau",
    },
    {
      network: "Facebook",
      name: "The Symbolic World",
      url: "https://www.facebook.com/TheSymbolicWorld",
      personSlug: "jonathan-pageau",
    },
  ],
} as const;

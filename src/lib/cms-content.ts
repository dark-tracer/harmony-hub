import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { portrait, gallery } from "@/lib/memorial-data";

export type ContentKey = "shared" | "home" | "obituary" | "service-details" | "order-of-service" | "photo-gallery" | "slideshow" | "tributes" | "family-tributes";
export type CmsDocument = Record<string, unknown>;

export const contentKeys: { key: ContentKey; label: string; path: string }[] = [
  { key: "shared", label: "Header & Footer", path: "/" },
  { key: "home", label: "Home", path: "/" },
  { key: "slideshow", label: "Homepage Slideshow", path: "/" },
  { key: "obituary", label: "Obituary", path: "/obituary" },
  { key: "service-details", label: "Service Details", path: "/service-details" },
  { key: "order-of-service", label: "Order of Service", path: "/order-of-service" },
  { key: "photo-gallery", label: "Photo Gallery", path: "/photo-gallery" },
  { key: "family-tributes", label: "Family Tributes", path: "/family-tributes" },
  { key: "tributes", label: "Guest Book", path: "/tributes" },
];

export const defaults = {
  shared: {
    name: "JOYCE DEDO NARH", descriptor: "Mama Joyce (1967–2026)", footerTitle: "In Loving Memory of Joyce Dedo Narh",
    footerYears: "Mama Joyce • 1967 – 2026", footerMessage: "Celebrating a Life of Grace, Faith, and Generosity", footerClosing: "Damirifa Due",
    navigation: ["Home", "Obituary", "Service Details", "Order of Service", "Photo Gallery", "Family Tributes", "Guest Book"],
  },
  home: {
    eyebrow: "Celebration of a Cherished Life", name: "Joyce Dedo Narh", nickname: "Affectionately known as Mama Joyce", years: "1967 — 2026",
    introduction: "A beacon of warmth, timeless dignity, and unwavering faith whose love continues to shelter and guide generations.", portraitUrl: portrait, portraitAlt: "Joyce Dedo Narh, Mama Joyce", age: "59", ageLabel: "Years of Grace",
    verse: "“The Lord gave, and the Lord hath taken away; blessed be the name of the Lord.”", verseReference: "Job 1:21",
    sectionEyebrow: "Memorial Keep-Sake", sectionTitle: "Commemoration & Service", sectionText: "Explore the chapters of Mama Joyce’s earthly pilgrimage, liturgical proceedings, and shared moments of joy.",
    cards: [
      { kicker: "Biography", title: "Obituary & Life Story", text: "Read her inspiring journey of faith, maternal devotion, entrepreneurship, and generous communal service.", action: "Read Biography", path: "/obituary" },
      { kicker: "Ceremonies", title: "Service Details", text: "Locations, timings, protocol, and reception details for the Burial Service and Thanksgiving.", action: "View Venues & Times", path: "/service-details" },
      { kicker: "Liturgy", title: "Order of Service", text: "Follow the formal sequence of worship, selected scripture readings, choir hymns, and memorial readings.", action: "Follow Liturgy", path: "/order-of-service" },
      { kicker: "Memories", title: "Photo Gallery", text: "Curated archival albums capturing Mama Joyce’s radiant smile, family milestones, and cherished memories.", action: "Browse Photographs", path: "/photo-gallery" },
    ],
    slides: gallery.slice(0, 5).map(([url, caption]) => ({ url, caption, show: "yes" })),
    welcomeTitle: "Welcome", servicesEyebrow: "Gather With Us", galleryEyebrow: "Treasured Moments", galleryTitle: "A Life in Pictures", galleryAction: "View gallery",
    farewellEyebrow: "Traditional Farewell", farewellTitle: "Damirifa Due, Mama Joyce.", farewellText: "May the angels escort you peacefully to your eternal home of rest in the bosom of Abraham.", farewellAction: "Order of Service",
  },
  obituary: {
    eyebrow: "In Loving Memorial • 1967 – 2026", title: "Her Journey & Life Story", subtitle: "A Life Well Lived, Grounded in Faith, Family & Grace", portraitUrl: portrait, portraitAlt: "Portrait of Mama Joyce",
    monographLabel: "Biographical Monograph", name: "Joyce Dedo Narh", nickname: "Affectionately known to all as “Mama Joyce”", sunrise: "September 14, 1967", sunset: "February 18, 2026", locations: "Eastern Region, Ghana • Accra • Somanya", devotion: "Fifty-Nine Years of Boundless Devotion and Sacred Service",
    chapters: [
      { number: "I", title: "Early Life & Foundations", paragraphs: ["Born in 1967 amid the verdant hills and fertile soils of the Eastern Region of Ghana, Joyce Dedo Narh was welcomed into the world as a beacon of promise. From her earliest childhood, she bore the hallmarks of her heritage: an unshakable dignity, an appetite for industrious effort, and a profound instinct toward kindness.", "Growing up in a tight-knit community anchored by tradition, young Joyce absorbed the ancestral virtues of reverence, respect for elders, and communal solidarity. Her home was an academy of practical grace, and she approached every task with silent diligence and radiant good humor."] },
      { number: "II", title: "Her Work, Faith & Devotion", paragraphs: ["Throughout her life, Joyce expressed her profound Christian faith not merely through words, but as an active, daily liturgy of hospitality and compassion. Her bended knees at daybreak set the rhythm of her household.", "In the lively commerce of the marketplace, Mama Joyce was respected as a pillar of integrity. Her stall was never simply a venue of trade; it was a sanctuary where young apprentices received guidance and troubled neighbors found an attentive ear."] },
      { number: "III", title: "A Legacy of Love", paragraphs: ["To reflect upon Mama Joyce’s 59 years on this earth is to witness what happens when one soul chooses unconditional love as a vocation. She was an architect of memories and a mother to many beyond her own household.", "Though her physical voice has quieted, its echo remains in every life she strengthened. Her legacy is not measured in possessions, but in prayers uttered, burdens shared, and generations taught to walk with dignity."] },
    ],
    quote: "“To touch even one life with genuine warmth and selfless generosity is to leave an indelible mark upon eternity.”", quoteSource: "— The Personal Creed of Joyce Dedo Narh",
  },
  "service-details": {
    eyebrow: "Ceremonial Order & Itinerary", title: "Service Details & Arrangements", subtitle: "Gathering in faith and thanksgiving to honor a cherished life",
    services: [
      { label: "Solemn Rites", title: "Burial Service", order: "Order I", mapUrl: "https://www.google.com/maps/search/?api=1&query=Social+Welfare+La+Nkwantanang+Madina", details: [{ label: "Date & Time", value: "Saturday, 17th October 2026\n9:00 AM Prompt" }, { label: "Venue & Grounds", value: "Social Welfare Grounds\nLa Nkwantanang, Madina, Greater Accra" }, { label: "Prescribed Attire", value: "Traditional Black & White or Formal Black Funeral Attire" }] },
      { label: "Celebration of Life", title: "Thanksgiving Service", order: "Order II", mapUrl: "https://www.google.com/maps/search/?api=1&query=ICGC+Christ+Temple+East+Teshie+Accra", details: [{ label: "Schedule Notice", value: "[Date & Time to be confirmed]\nDetails will be updated as soon as arrangements conclude." }, { label: "Sanctuary", value: "ICGC Christ Temple East\nTeshie Rasta Rd, Teshie, Accra, Ghana" }, { label: "Prescribed Attire", value: "Joyful All-White or Elegant Black & White Thanksgiving Attire" }] },
    ],
    guidanceEyebrow: "Guest Guidance", guidanceTitle: "General Information & Etiquette", guidanceIntro: "Helpful guidance to ensure the comfort, dignity, and serene reflection of all congregants.",
    guidance: [{ title: "Parking & Arrival", text: "Designated parking areas are reserved at both venues with parking marshals in attendance. Guests are gently encouraged to arrive 20–30 minutes ahead of scheduled time." }, { title: "Accessibility Care", text: "Step-free ground access, wheelchair ramps, and reserved seating are designated for senior relatives, elderly congregants, and guests requiring mobility assistance." }, { title: "Sanctuary Decorum", text: "To preserve reverence during prayers and homilies, mobile devices should be switched to silent mode. Only designated memorial media stewards may record the rites." }],
    closingQuote: "“All are warmly welcomed to celebrate Mama Joyce’s life and legacy in peace and reverence.”", closingLine: "Medasi • Damirifa Due • Aseda",
  },
  "order-of-service": {
    eyebrow: "Order of Liturgy", title: "Order of Service", subtitle: "Liturgy, Songs of Praise & Words of Remembrance", themeLabel: "Theme of the Liturgy", theme: "“The Lord is my shepherd; I shall not want. Surely goodness and mercy shall follow me all the days of my life.”", partLabel: "Part I • Morning Ceremony", liturgyTitle: "Burial Service Liturgy", printLabel: "Print",
    movements: [
      ["Processional Hymn","Congregational","“Great Is Thy Faithfulness” — Hymn of opening, solemn procession of clergy and family."], ["Opening Prayer & Scripture Reading","Scripture","Psalm 23 & 1 Thessalonians 4:13–18 — Words of eternal hope and invocation of the Holy Spirit."], ["Memorial Hymn","Congregational","“Abide With Me” — Fast falls the eventide; the darkness deepens; Lord, with me abide."], ["Reading of Biography & Tributes","Remembrance","A reflective account of Mama Joyce’s life journey, sacred maternal grace, and communal devotion."], ["Musical Interlude & Choir Ministration","Choral Anthem","Sacred chorale presentation commemorating lifelong faith and praise."], ["Scripture Reading & Eulogy","Solemn Word","2 Timothy 4:7–8 — “I have fought the good fight, I have finished the race, I have kept the faith.”"], ["The Sermon & Word of Comfort","Homily","Proclamation of the Gospel message and reassurance of resurrection peace to the bereaved."], ["Prayer of Commendation & Thanksgiving","Commendation","Entrusting our mother into the gentle, everlasting arms of Almighty God."], ["Recessional Hymn","Procession","“Guide Me, O Thou Great Jehovah” — Journeying forward in celestial guidance."],
    ].map(([title,type,text])=>({title,type,text})),
    thanksgivingLabel: "Part II • Thanksgiving", thanksgivingTitle: "Thanksgiving Service",
    thanksgivingDate: "Sunday, 18th October 2026", thanksgivingTime: "10:00 AM Prompt",
    thanksgivingVenue: "ICGC Christ Temple East", thanksgivingAddress: "Teshie Rasta Rd, Teshie, Accra, Ghana",
    bookletLabel: "Keepsake Booklet Protocol", bookletTitle: "Physical Order of Service Distribution", bookletText: "Physical, embossed memorial keepsakes with complete hymn lyrics, scriptural readings, and tribute texts will be handed to all congregants upon arrival at the sanctuary foyer.",
  },
  slideshow: {
    slides: gallery.slice(0, 5).map(([url, caption]) => ({ url, caption, show: "yes" })),
  },
  "photo-gallery": {
    eyebrow: "The Visual Archive", title: "Photo Gallery & Treasured Memories", subtitle: "Moments of joy, laughter, and timeless grace across 59 beautiful years", intro: "Every portrait and candid snapshot reflects Mama Joyce’s luminous faith, warm embrace, and infectious laughter. May her peace and enduring kindness bring comfort and sacred celebration.", allLabel: "All Memories",
    photos: gallery.map(([url, caption, category]) => ({ url, caption, category })),
    closingQuote: "“Her smile remains etched in our hearts forever.”", closingText: "In every warm embrace she offered, every hymn she sang, and every soul she comforted, Mama Joyce left behind a tapestry of light that no passage of time can dim.", closingLine: "Aseda • Damirifa Due • 1967 – 2026",
  },
  "family-tributes": {
    eyebrow: "From Those Who Loved Her",
    title: "Family Tributes",
    subtitle: "Words of love and remembrance from the family of Mama Joyce",
  },
  tributes: {
    eyebrow: "Words of Remembrance",
    title: "Guest Book",
    subtitle: "Messages of love, gratitude, and cherished memories from family and friends",
    introduction: "Her kindness lives on in the stories we carry. These words celebrate the countless ways Mama Joyce brought faith, warmth, and generosity into the lives around her.",
    closingQuote: "“What we have once enjoyed deeply we can never lose. All that we love deeply becomes a part of us.”",
    closingLine: "Forever in our hearts",
  },
} satisfies Record<ContentKey, CmsDocument>;

const cache = new Map<ContentKey, CmsDocument>();

export function useCmsContentStatus<K extends ContentKey>(key: K): [(typeof defaults)[K], boolean] {
  const cached = cache.get(key);
  const [content, setContent] = useState<(typeof defaults)[K]>((cached ? { ...defaults[key], ...cached } : defaults[key]) as (typeof defaults)[K]);
  const [loaded, setLoaded] = useState(!!cached);
  useEffect(() => {
    const previewKey = `cms-preview-${key}`;
    const isPreview = new URLSearchParams(window.location.search).has("cmsPreview");
    const loadPreview = () => {
      if (!isPreview) return false;
      const preview = localStorage.getItem(previewKey);
      if (preview) { try { setContent({ ...defaults[key], ...JSON.parse(preview) }); setLoaded(true); return true; } catch { localStorage.removeItem(previewKey); } }
      return false;
    };
    if (!loadPreview()) supabase.from("site_content").select("content").eq("content_key", key).maybeSingle().then(({ data }) => {
      if (data?.content) { cache.set(key, data.content as CmsDocument); setContent({ ...defaults[key], ...(data.content as object) } as (typeof defaults)[K]); }
      setLoaded(true);
    });
    const listener = (event: StorageEvent) => { if (event.key === previewKey) loadPreview(); };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [key]);
  return [content, loaded];
}

export function useCmsContent<K extends ContentKey>(key: K): (typeof defaults)[K] {
  return useCmsContentStatus(key)[0];
}

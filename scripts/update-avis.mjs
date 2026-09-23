/*
 * Met à jour assets/data/avis.json avec la note et les derniers avis Google.
 * Lancé une fois par jour (voir .github/workflows/avis-google.yml).
 *
 * Usage : GOOGLE_PLACES_KEY=xxx node scripts/update-avis.mjs
 * Option : GOOGLE_PLACE_ID=ChIJ... pour viser la fiche exacte (sinon recherche par nom).
 */
import { writeFile, mkdir } from "node:fs/promises";

const KEY = process.env.GOOGLE_PLACES_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const QUERY = "Brasserie Jaja, 47 rue d'Amsterdam, 75008 Paris";
const OUT = new URL("../assets/data/avis.json", import.meta.url);
const FIELDS = ["id", "rating", "userRatingCount", "reviews", "googleMapsUri"];

if (!KEY) {
  console.error("GOOGLE_PLACES_KEY manquante.");
  process.exit(1);
}

async function call(url, init) {
  const res = await fetch(url, init);
  const body = await res.json();
  if (!res.ok) throw new Error(`Google Places ${res.status} : ${JSON.stringify(body.error || body)}`);
  return body;
}

async function fetchPlace(lang) {
  const headers = { "X-Goog-Api-Key": KEY };
  if (PLACE_ID) {
    return call(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=${lang}`, {
      headers: { ...headers, "X-Goog-FieldMask": FIELDS.join(",") }
    });
  }
  const data = await call("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", "X-Goog-FieldMask": FIELDS.map((f) => "places." + f).join(",") },
    body: JSON.stringify({ textQuery: QUERY, languageCode: lang, pageSize: 1 })
  });
  if (!data.places || !data.places.length) throw new Error("Fiche Google introuvable pour : " + QUERY);
  return data.places[0];
}

const toReview = (r) => ({
  author: r.authorAttribution?.displayName || "Client Google",
  authorUrl: r.authorAttribution?.uri || "",
  photo: r.authorAttribution?.photoUri || "",
  rating: r.rating,
  when: r.relativePublishTimeDescription || "",
  text: (r.text?.text || r.originalText?.text || "").trim()
});

const place = await fetchPlace("fr");
if (!PLACE_ID) console.log("Place ID trouvé :", place.id, "(à mettre dans GOOGLE_PLACE_ID)");

const reviews = (place.reviews || [])
  .map(toReview)
  .filter((r) => r.rating >= 4 && r.text.length > 20);

const out = {
  updatedAt: new Date().toISOString(),
  rating: Math.round(place.rating * 10) / 10,
  reviewCount: place.userRatingCount,
  url: place.googleMapsUri,
  reviews
};

await mkdir(new URL("../assets/data/", import.meta.url), { recursive: true });
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`OK : ${out.rating}/5, ${out.reviewCount} avis, ${reviews.length} avis 4-5★ affichables.`);

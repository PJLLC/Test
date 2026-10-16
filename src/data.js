export const destinations = [
  {
    id: 'dolomites', name: 'The Dolomites', country: 'Italy', region: 'Europe', type: 'Outdoors', budget: 'Mid-range', days: '5–7 days', season: 'June – September', rating: 4.9, tagline: 'A little closer to the clouds.', image: 'art/dolomites.svg', color: '#6d8b7f', label: 'A breath of fresh air',
    description: 'Pale limestone peaks, impossibly green meadows, and little mountain huts with very good cake. The Dolomites reward a slower pace: pick a valley, lace up your boots, and leave a little room for getting wonderfully lost.',
    highlights: ['Walk the meadows around Alpe di Siusi', 'Watch the light change at Lago di Braies', 'Share a warm lunch in a mountain rifugio'],
    itinerary: [['Settle into the mountains', 'Make Ortisei your base. Wander its quiet lanes, find a bakery, and take an easy evening walk.'], ['A day above the clouds', 'Take the lift to Seceda, weather permitting, and follow a marked ridge trail suited to your experience.'], ['Lake days & slow lunches', 'Start early at Lago di Braies, then spend the afternoon in a village café. Allow extra days for longer hikes.']],
    tip: 'Mountain weather changes quickly. Check local forecasts and lift schedules, and carry layers even in summer.', author: 'Alex', quote: 'The kind of place that makes you put your phone away. The mountain hut lunches alone are worth the hike.'
  },
  {
    id: 'kyoto', name: 'Kyoto', country: 'Japan', region: 'Asia', type: 'Culture', budget: 'Mid-range', days: '4–5 days', season: 'March – May / October – November', rating: 4.9, tagline: 'Where the quiet moments stay with you.', image: 'art/kyoto.svg', color: '#b66c60', label: 'Culture, at your own pace',
    description: 'Temple gardens, lantern-lit lanes, and the ritual of a beautifully made cup of tea. Kyoto is a city of small discoveries. Step away from the busiest streets and let an unplanned afternoon lead the way.',
    highlights: ['Explore a peaceful temple garden', 'Walk along the Philosopher’s Path', 'Make time for a traditional tea experience'],
    itinerary: [['East-side wandering', 'Walk through Higashiyama early, visit a temple, and settle into a neighborhood lunch spot.'], ['Gardens & tea', 'Spend a slow morning in a garden and book a tea experience with a local host.'], ['A different side of Kyoto', 'Head toward the northern neighborhoods or explore riverside paths. Leave an afternoon for a favorite discovery.']],
    tip: 'Respect photography restrictions and private streets. Popular temples are much calmer just after opening.', author: 'Maya', quote: 'My favorite memory was a tiny tea shop we found by accident. Give yourself time to wander.'
  },
  {
    id: 'amalfi', name: 'Amalfi Coast', country: 'Italy', region: 'Europe', type: 'Coast', budget: 'Splurge', days: '4–6 days', season: 'May – June / September', rating: 4.8, tagline: 'Life, with a little more lemon.', image: 'art/amalfi.svg', color: '#a68a56', label: 'The art of doing less',
    description: 'Pastel villages tumble toward a blue sea, lemon trees perfume the terraces, and lunch somehow becomes an entire afternoon. Choose one seaside base and explore the coast a little at a time.',
    highlights: ['Take a ferry between coastal villages', 'Explore the gardens above Ravello', 'Find a quiet terrace for a long lunch'],
    itinerary: [['Arrive & exhale', 'Settle into your coastal base and explore on foot. Save sunset for the waterfront.'], ['See it from the sea', 'Check conditions and take a local ferry to a neighboring village. Return in time for a leisurely dinner.'], ['Up in the gardens', 'Spend a day in Ravello, with a garden visit and a long café stop before heading back to the coast.']],
    tip: 'Ferries are seasonal and weather dependent. Check current schedules and keep a flexible plan.', author: 'Jamie', quote: 'Go in the shoulder season, take the ferry, and order the lemon pasta. That’s my entire travel advice.'
  },
  {
    id: 'marrakech', name: 'Marrakech', country: 'Morocco', region: 'Africa', type: 'Culture', budget: 'Budget-friendly', days: '3–4 days', season: 'March – May / October – November', rating: 4.7, tagline: 'A beautiful kind of getting lost.', image: 'art/marrakech.svg', color: '#b96b47', label: 'Follow your curiosity',
    description: 'Earthy walls, intricate courtyards, the scent of warm bread and orange blossom. Marrakech is full of energy, with pockets of stillness tucked behind unassuming doors. A courtyard riad makes a lovely base.',
    highlights: ['Discover the craft stalls of the medina', 'Pause in a tiled courtyard garden', 'Try a cooking class with a local host'],
    itinerary: [['Find your bearings', 'Take a guided introduction to the medina and return to your riad for a quiet evening.'], ['Craft & courtyards', 'Explore historic architecture, watch artisans at work, and make space for a slow lunch.'], ['A taste of the city', 'Book a cooking class and spend your final afternoon revisiting your favorite neighborhood.']],
    tip: 'Ask before photographing people, agree prices in advance, and check the dress guidance for each site.', author: 'Samira', quote: 'The courtyard breakfasts and the craftsmanship were extraordinary. A local guide made our first day so much easier.'
  },
  {
    id: 'bali', name: 'Ubud, Bali', country: 'Indonesia', region: 'Asia', type: 'Outdoors', budget: 'Budget-friendly', days: '5–7 days', season: 'May – September', rating: 4.8, tagline: 'Make room for a slower rhythm.', image: 'art/bali.svg', color: '#587950', label: 'Take the scenic route',
    description: 'Lush valleys, hand-carved doorways, and mornings that begin with birdsong. Around Ubud, days can be as full or as quiet as you like. Stay a little outside the center for leafy paths and a gentler pace.',
    highlights: ['Walk through the surrounding rice landscapes', 'Discover local painting and woodcarving', 'Try regional dishes at a neighborhood warung'],
    itinerary: [['A gentle beginning', 'Settle into your stay, explore nearby lanes, and enjoy an unhurried local meal.'], ['Fields & forest', 'Book a local walking guide to explore agricultural landscapes and learn about the irrigation system.'], ['Art & everyday life', 'Visit a small gallery, join a craft class, and leave time for a quiet afternoon.']],
    tip: 'Wear appropriate temple clothing and follow local guidance. Rice fields are working farms; use marked paths.', author: 'Noah', quote: 'Staying outside the center was the best decision. Early morning walks became our favorite part of every day.'
  },
  {
    id: 'lisbon', name: 'Lisbon', country: 'Portugal', region: 'Europe', type: 'City breaks', budget: 'Budget-friendly', days: '3–4 days', season: 'April – June / September – October', rating: 4.8, tagline: 'Hills, tiled walls, and golden afternoons.', image: 'art/lisbon.svg', color: '#c38b4f', label: 'A city with a little soul',
    description: 'A city best discovered one steep street at a time. Lisbon pairs grand river views with tiny neighborhood bakeries, tiled façades, and late dinners. Bring comfortable shoes and an appetite for one more pastry.',
    highlights: ['Find a favorite neighborhood miradouro', 'Explore the tiled streets of Alfama', 'Try a warm pastel de nata'],
    itinerary: [['Find your neighborhood', 'Walk around your base, stop for coffee, and finish the day at a nearby viewpoint.'], ['Old streets & river light', 'Explore Alfama on foot and spend the afternoon along the waterfront.'], ['An unhurried last day', 'Visit a museum or market and make time to return to your favorite bakery.']],
    tip: 'Wear shoes with good grip on polished cobblestones, and respect residents when exploring quieter lanes.', author: 'Ella', quote: 'We walked everywhere, ate far too many pastries, and watched a different sunset every evening.'
  }
];

export function filterDestinations(items, {query = '', type = 'All places', region = '', budget = '', savedOnly = false, saved = []} = {}) {
  const search = query.trim().toLowerCase();
  return items.filter(d => (!search || `${d.name} ${d.country} ${d.region} ${d.type}`.toLowerCase().includes(search)) && (type === 'All places' || d.type === type) && (!region || d.region === region) && (!budget || d.budget === budget) && (!savedOnly || saved.includes(d.id)));
}

export function reviewSummary(destination, reviews = []) {
  const initial = 1; // One explicitly labeled sample review per guide.
  return { count: initial + reviews.length, rating: ((destination.rating + reviews.reduce((sum, r) => sum + r.rating, 0)) / (initial + reviews.length)).toFixed(1) };
}

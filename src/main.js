import './style.css';
import { destinations, filterDestinations, reviewSummary } from './data.js';

const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  mountain: '<path d="m2 20 7-13 4 6 3-9 6 16H2Zm5-9 2 2 2-2m3-1 2 2 2-2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  building: '<path d="M4 21V8h7v13M11 21V3h9v18M2 21h20M7 11v1m0 3v1m7-9h3m-3 4h3m-3 4h3"/>',
  culture: '<path d="m3 9 9-6 9 6H3Zm0 12h18M5 10v8m7-8v8m7-8v8M3 18h18"/>',
  star: '<path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3L2.8 9.7l6.4-.9L12 3Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>', leaf: '<path d="M20 3C7 1 1 11 7 17s16 0 13-14ZM4 21 16 9"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>', pen: '<path d="m15 5 4 4M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15l-1 5Z"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.globe}</svg>`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
let storageAvailable = true;
function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { storageAvailable = false; return fallback; }
}
const rawSaved = readStorage('elsewhere-saved', []);
let saved = Array.isArray(rawSaved) ? rawSaved.filter(id => destinations.some(d => d.id === id)) : [];
const rawReviews = readStorage('elsewhere-reviews', []);
let reviews = Array.isArray(rawReviews) ? rawReviews.filter(r => r && destinations.some(d => d.id === r.destination) && typeof r.name === 'string' && r.name.length <= 60 && typeof r.text === 'string' && r.text.length <= 1200 && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 && typeof r.date === 'string' && !isNaN(Date.parse(r.date))) : [];
const state = {query: '', type: 'All places', region: '', budget: '', savedOnly: false, sort: 'featured'};
let returnFocus = null;
let toastTimer;

document.querySelector('#app').innerHTML = `
  <a href="#destinations" class="skip-link">Skip to destinations</a>
  <header class="site-header"><a class="logo" href="#" aria-label="Elsewhere home">${icon('mountain')}elsewhere<span class="logo-dot">.</span></a>
    <nav aria-label="Main navigation"><a href="#destinations" class="nav-explore">Explore</a><a href="#journal">The journal</a><a href="#about">Our philosophy</a></nav>
    <div class="header-actions"><button id="saved-nav" class="saved-nav" aria-label="Saved places">${icon('heart')}<span>Saved places</span><span class="saved-count">${saved.length}</span></button><button class="button button-dark header-review" data-review>${icon('pen')} Write a review</button></div>
  </header>
  <main>
    <section class="hero" aria-labelledby="hero-title"><img class="hero-art" src="art/hero.svg" alt="An illustrated alpine lake beneath dramatic mountain peaks" fetchpriority="high"/><div class="hero-shade"></div>
      <div class="hero-copy"><div class="eyebrow light"><span></span> FOR THE WANDERERS AT HEART</div><h1 id="hero-title">A little further<br>from <em>ordinary.</em></h1><p>Places that move you. Stories that stay with you.<br>Find your next somewhere.</p><a class="hero-link" href="#destinations">Let’s find your elsewhere ${icon('arrow')}</a></div>
      <div class="hero-caption">${icon('pin')} Inspired by the Italian Dolomites <span>46.4983° N, 11.3548° E</span></div>
      <div class="hero-side">LESS SCROLLING. MORE WANDERING.</div>
    </section>
    <div class="search-wrap"><form id="search-form" class="search-panel"><label class="search-destination">${icon('search')}<span><span class="field-label">YOUR NEXT CHAPTER</span><input id="search" type="search" placeholder="Where do you want to go?" aria-label="Search destinations" maxlength="100"/></span></label><label class="search-region"><span class="field-label">A CORNER OF THE WORLD</span><select id="region" aria-label="Filter by region"><option value="">Anywhere sounds good</option><option>Europe</option><option>Asia</option><option>Africa</option></select></label><button class="button button-dark search-button" type="submit">Find my adventure ${icon('arrow')}</button></form></div>
    <div class="trust-line"><span>${icon('book')} Thoughtful guides</span><i>·</i><span>${icon('heart')} Personal perspectives</span><i>·</i><span>${icon('leaf')} A slower way to travel</span></div>
    <section id="destinations" class="section destinations-section" aria-labelledby="destinations-heading"><div class="section-heading"><div><div class="eyebrow">GOOD PLACES. GREAT STORIES.</div><h2 id="destinations-heading">Somewhere worth <em>going.</em></h2><p>A few favorites to spark your next adventure.</p></div><span class="handwritten">The world is still full of wonder <span>↙</span></span></div>
      <div class="filter-row"><div class="category-list" role="group" aria-label="Trip style">${[['All places','globe'],['Outdoors','mountain'],['Coast','sun'],['City breaks','building'],['Culture','culture']].map(([label, key], i) => `<button class="category ${i === 0 ? 'active' : ''}" data-category="${label}" aria-pressed="${i === 0}">${icon(key)}${label}</button>`).join('')}</div><label class="budget-filter"><span class="sr-only">Filter by budget</span><select id="budget"><option value="">Every budget</option><option>Budget-friendly</option><option>Mid-range</option><option>Splurge</option></select></label></div>
      <div class="results-toolbar"><p id="results-count" aria-live="polite"></p><div><button id="clear-filters" class="text-button" hidden>Clear filters ${icon('close')}</button><label class="sort-label">Sort by <select id="sort" aria-label="Sort destinations"><option value="featured">Our favorites</option><option value="rating">Traveler rating</option><option value="name">Name: A–Z</option></select></label></div></div>
      <div id="destination-grid" class="destination-grid"></div><div id="empty-state" class="empty-state" hidden>${icon('globe')}<h3>A different path, perhaps?</h3><p id="empty-message"></p><button class="button button-dark" id="reset-search">Explore all places ${icon('arrow')}</button></div>
      <p class="demo-note">A little transparency: this is a demo travel journal. Guides are illustrative, and sample reviews are labeled. Always verify current local conditions.</p>
    </section>
    <section class="slow-banner section" id="about"><div class="banner-art"><img src="art/postcard.svg" alt="Illustrated postcard with a winding path through sunlit hills" loading="lazy"/><span class="postcard-stamp">TAKE THE<br>LONG WAY.</span></div><div class="banner-copy"><div class="eyebrow">IT’S NOT JUST WHERE. IT’S HOW.</div><h2>Collect moments.<br><em>Not just miles.</em></h2><p>We believe the best trips leave room for the unexpected. The wrong turn. The long lunch. The conversation that becomes a friendship.</p><p>Elsewhere is a little inspiration to travel with more curiosity, more care, and a little less hurry.</p><a href="#journal" class="underlined-link">A few notes from the road ${icon('arrow')}</a></div></section>
    <section id="journal" class="section journal-section" aria-labelledby="journal-heading"><div class="section-heading"><div><div class="eyebrow">NOTES FROM THE ROAD</div><h2 id="journal-heading">A little travel <em>inspiration.</em></h2></div><span class="journal-aside">For your next daydream.</span></div><div class="journal-grid">${[
      ['kyoto','THE SLOW TRAVEL EDIT','The joy of leaving an afternoon unplanned','2 MIN OF INSPIRATION'],
      ['amalfi','A DIFFERENT PERSPECTIVE','A coast best discovered one village at a time','2 MIN OF INSPIRATION'],
      ['lisbon','SMALL MOMENTS','In search of a very good pastry','2 MIN OF INSPIRATION']
    ].map(([id, tag, title, time]) => `<button class="journal-card" data-story="${id}"><div class="journal-image"><img src="${destinations.find(d => d.id === id).image}" alt="" loading="lazy"/><span>${icon('arrow')}</span></div><div class="eyebrow">${tag}</div><h3>${title}</h3><span class="reading-time">${time}</span></button>`).join('')}</div></section>
    <section class="closing-note"><div class="eyebrow">YOUR NEXT STORY IS OUT THERE</div><h2>Go somewhere.<br><em>Feel something.</em></h2><button class="button button-dark" id="surprise">Surprise me with a place ${icon('arrow')}</button><span class="closing-doodle" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M50 5v90M5 50h90M18 18l64 64M18 82l64-64"/></svg></span></section>
  </main>
  <footer><a class="logo" href="#">${icon('mountain')}elsewhere<span class="logo-dot">.</span></a><p>A little further from ordinary.</p><span>A demo made for curious travelers. <span class="footer-separator">·</span> Illustrations by Elsewhere.</span><button class="text-button" data-review>Share your story ${icon('arrow')}</button></footer>
  <dialog id="guide-dialog" aria-labelledby="guide-title"><button class="dialog-close" data-close="guide-dialog" aria-label="Close guide">${icon('close')}</button><div id="guide-content"></div></dialog>
  <dialog id="review-dialog" aria-labelledby="review-title"><button class="dialog-close" data-close="review-dialog" aria-label="Close review form">${icon('close')}</button><div class="review-dialog-inner"><div class="eyebrow">A NOTE FROM YOUR JOURNEY</div><h2 id="review-title">Share your <em>story.</em></h2><p class="form-intro">What made a place special? Your perspective makes the guide a little richer.</p><form id="review-form"><label>Where did you go?<select name="destination" required>${destinations.map(d => `<option value="${d.id}">${d.name}, ${d.country}</option>`).join('')}</select></label><label>Your name<input name="name" autocomplete="given-name" placeholder="First name is perfect" maxlength="60" required/></label><fieldset class="rating-field"><legend>Your rating</legend><div class="rating-options">${[1,2,3,4,5].map(n => `<label><input type="radio" name="rating" value="${n}" required/><span>${icon('star')} ${n}<span class="sr-only"> out of 5</span></span></label>`).join('')}</div></fieldset><label>Your experience<textarea name="text" rows="4" minlength="15" maxlength="1200" placeholder="The little details, a favorite moment, something you wish you’d known…" required></textarea></label><p class="form-note">Reviews are saved in this browser only. They aren’t published or shared with other travelers. Please keep personal details private.</p><button class="button button-dark" type="submit">Save my review ${icon('arrow')}</button></form></div></dialog>
  <dialog id="story-dialog" aria-labelledby="story-title"><button class="dialog-close" data-close="story-dialog" aria-label="Close story">${icon('close')}</button><div id="story-content"></div></dialog>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
`;

function notify(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
}
function persist(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { storageAvailable = false; notify('Browser storage is unavailable. Changes will last for this visit only.'); return false; }
}
function saveButton(d, extra = '') {
  const isSaved = saved.includes(d.id);
  return `<button class="save-button ${isSaved ? 'is-saved' : ''} ${extra}" data-save="${d.id}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${d.name}" aria-pressed="${isSaved}">${icon('heart')}</button>`;
}
function renderDestinations() {
  const focusedSave = document.activeElement?.dataset.save;
  const guideReturnId = returnFocus?.dataset.guide;
  let items = filterDestinations(destinations, {...state, saved});
  if (state.sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
  if (state.sort === 'rating') items.sort((a,b) => Number(reviewSummary(b, reviews.filter(r=>r.destination===b.id)).rating) - Number(reviewSummary(a, reviews.filter(r=>r.destination===a.id)).rating));
  document.querySelector('#destinations-heading').innerHTML = state.savedOnly ? 'Places for <em>another day.</em>' : 'Somewhere worth <em>going.</em>';
  document.querySelector('#results-count').textContent = `${items.length} ${state.savedOnly ? 'saved ' : ''}${items.length === 1 ? 'place' : 'places'} to ${state.savedOnly ? 'dream about' : 'discover'}`;
  document.querySelector('#clear-filters').hidden = !(state.query || state.type !== 'All places' || state.region || state.budget || state.savedOnly);
  document.querySelector('#destination-grid').innerHTML = items.map(d => {
    const summary = reviewSummary(d, reviews.filter(r=>r.destination===d.id));
    return `<article class="destination-card"><div class="card-image"><a href="#guide-${d.id}" data-guide="${d.id}" tabindex="-1" aria-hidden="true"><img src="${d.image}" alt="" loading="lazy"/></a><span class="card-label">${d.label}</span>${saveButton(d)}</div><div class="card-content"><div class="card-location">${icon('pin')}${d.country}<span class="card-rating">${icon('star')} ${summary.rating}<span>(${summary.count}${summary.count === 1 ? ' sample' : ' incl. sample'})</span></span></div><h3><a href="#guide-${d.id}" data-guide="${d.id}">${d.name}</a></h3><p>${d.tagline}</p><div class="card-bottom"><span>${icon('clock')}${d.days}<span class="tag-dot">·</span>${d.type}</span><button class="card-guide-link" data-guide="${d.id}" aria-label="Read guide to ${d.name}">${icon('arrow')}</button></div></div></article>`;
  }).join('');
  document.querySelector('#empty-state').hidden = items.length > 0;
  document.querySelector('#empty-message').textContent = state.savedOnly ? 'Save a place with the heart button, or adjust your filters to see your collection.' : 'No destinations match just yet. Try another search or explore all six guides.';
  document.querySelectorAll('[data-category]').forEach(b => {const active = b.dataset.category === state.type; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active);});
  document.querySelector('.saved-count').textContent = saved.length;
  document.querySelector('#saved-nav').classList.toggle('selected', state.savedOnly);
  document.querySelector('#saved-nav').setAttribute('aria-pressed', state.savedOnly);
  if (focusedSave && !document.activeElement?.closest('dialog')) {
    (document.querySelector(`#destination-grid [data-save="${focusedSave}"]`) || document.querySelector('#saved-nav')).focus({preventScroll:true});
  }
  if (guideReturnId && !returnFocus?.isConnected) {
    returnFocus = document.querySelector(`.card-guide-link[data-guide="${guideReturnId}"]`) || document.querySelector('#saved-nav');
  }
}
function showDialog(id) {
  if (!document.activeElement?.closest('dialog')) returnFocus = document.activeElement;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  document.getElementById(id).showModal(); document.body.classList.add('modal-open');
}
function showGuide(id) {
  const d = destinations.find(d => d.id === id); if (!d) return;
  const added = reviews.filter(r=>r.destination===id);
  const summary = reviewSummary(d, added);
  document.querySelector('#guide-content').innerHTML = `<img class="guide-hero" src="${d.image}" alt="Illustration inspired by ${d.name}"/><div class="guide-body"><div class="eyebrow">${d.country.toUpperCase()} / ${d.type.toUpperCase()}</div><div class="guide-title-row"><h2 id="guide-title">${d.name}</h2>${saveButton(d, 'guide-save')}</div><p class="guide-tagline">${d.tagline}</p><div class="guide-facts"><span>${icon('clock')} ${d.days}</span><span>${icon('sun')} ${d.season}</span><span>${icon('globe')} ${d.budget}</span></div><p>${d.description}</p><h3>The little things to look for</h3><ul class="highlights">${d.highlights.map(h=>`<li>${icon('check')}${h}</li>`).join('')}</ul><h3>A starting point for your trip</h3><p class="muted">An easy three-day outline. Stay longer, take detours, make it yours.</p><div class="itinerary">${d.itinerary.map(([title, text], i)=>`<div><span class="day-number">0${i+1}</span><div><h4>${title}</h4><p>${text}</p></div></div>`).join('')}</div><aside class="guide-tip">${icon('leaf')}<div><strong>A thoughtful travel tip</strong><p>${d.tip}</p></div></aside><div class="reviews-heading"><div><h3>Notes from travelers</h3><span>${icon('star')} ${summary.rating} · ${summary.count} ${summary.count === 1 ? 'review' : 'reviews'} including 1 sample</span></div><button class="button button-outline" data-review="${id}">Write a review</button></div><div class="review-list">${[...added].reverse().map(r=>`<article class="review"><div class="review-avatar">${escape(r.name[0].toUpperCase())}</div><div><div class="review-meta"><strong>${escape(r.name)}</strong><span>Your local review · ${new Date(r.date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span></div><span class="review-stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span><p>${escape(r.text)}</p></div></article>`).join('')}<article class="review"><div class="review-avatar sample-avatar">${d.author[0]}</div><div><div class="review-meta"><strong>${d.author}</strong><span>Sample review · illustrative content</span></div><span class="review-stars">★ ${d.rating} / 5</span><p>${d.quote}</p></div></article></div><p class="demo-note">This guide is illustrative. Check official visitor information, access rules, weather, and current schedules before traveling. Ratings combine the sample rating with reviews saved in this browser.</p></div>`;
  showDialog('guide-dialog'); document.querySelector('#guide-dialog').scrollTop = 0;
}
function resetFilters() {
  Object.assign(state, {query:'',type:'All places',region:'',budget:'',savedOnly:false,sort:'featured'});
  document.querySelector('#search').value = ''; document.querySelector('#region').value = ''; document.querySelector('#budget').value = ''; document.querySelector('#sort').value = 'featured'; renderDestinations();
}
function scrollToPlaces() { document.querySelector('#destinations').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); }
document.querySelector('#search-form').addEventListener('submit', e=>{e.preventDefault(); state.query=document.querySelector('#search').value; state.region=document.querySelector('#region').value; state.savedOnly=false; renderDestinations(); scrollToPlaces();});
document.querySelector('#search').addEventListener('input', e=>{state.query=e.target.value; renderDestinations();});
document.querySelector('#region').addEventListener('change', e=>{state.region=e.target.value; renderDestinations();});
document.querySelector('#budget').addEventListener('change', e=>{state.budget=e.target.value; renderDestinations();});
document.querySelector('#sort').addEventListener('change', e=>{state.sort=e.target.value; renderDestinations();});
document.querySelector('#saved-nav').addEventListener('click', ()=>{const next=!state.savedOnly; resetFilters(); state.savedOnly=next; renderDestinations(); scrollToPlaces();});
document.querySelector('#clear-filters').addEventListener('click', resetFilters);
document.querySelector('#reset-search').addEventListener('click', resetFilters);
document.querySelector('#surprise').addEventListener('click', ()=>showGuide(destinations[Math.floor(Math.random()*destinations.length)].id));
document.addEventListener('click', e=>{
  const category=e.target.closest('[data-category]'); if(category){state.type=category.dataset.category; renderDestinations();}
  const save=e.target.closest('[data-save]'); if(save){const id=save.dataset.save; const removing=saved.includes(id); saved=removing?saved.filter(v=>v!==id):[...saved,id]; const stored=persist('elsewhere-saved',saved); renderDestinations(); document.querySelectorAll(`[data-save="${id}"]`).forEach(b=>{b.classList.toggle('is-saved',!removing); b.setAttribute('aria-pressed',!removing); b.setAttribute('aria-label',`${removing?'Save':'Unsave'} ${destinations.find(d=>d.id===id).name}`);}); if(stored) notify(removing?'Removed from your saved places.':'A little daydream, saved for later.');}
  const guide=e.target.closest('[data-guide]'); if(guide){e.preventDefault(); showGuide(guide.dataset.guide);}
  const review=e.target.closest('[data-review]'); if(review){const form=document.querySelector('#review-form'); form.reset(); if(review.dataset.review) form.elements.destination.value=review.dataset.review; showDialog('review-dialog');}
  const close=e.target.closest('[data-close]'); if(close) document.getElementById(close.dataset.close).close();
  const story=e.target.closest('[data-story]'); if(story) showStory(story.dataset.story);
});
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('close', ()=>{if(!document.querySelector('dialog[open]')) {document.body.classList.remove('modal-open'); if(returnFocus?.isConnected) returnFocus.focus();}});
  dialog.addEventListener('click', e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();}});
});
document.querySelector('#review-form').addEventListener('submit', e=>{
  e.preventDefault(); const form=e.target; const data=new FormData(form); const name=data.get('name').trim(); const text=data.get('text').trim();
  form.elements.name.setCustomValidity(name?'':'Please enter your name.'); form.elements.text.setCustomValidity(text.length>=15?'':'Please share at least 15 characters about your experience.'); if(!form.reportValidity()) return;
  const review={destination:data.get('destination'),name,text,rating:Number(data.get('rating')),date:new Date().toISOString()}; reviews.push(review); const stored=persist('elsewhere-reviews',reviews); renderDestinations(); showGuide(review.destination); if(stored) notify('Your review is saved in this browser. Thank you for sharing.');
});
document.querySelectorAll('#review-form input, #review-form textarea').forEach(el=>el.addEventListener('input',()=>el.setCustomValidity('')));

function showStory(id) {
  const d=destinations.find(d=>d.id===id);
  const stories={
    kyoto:{title:'The joy of leaving an afternoon unplanned', subtitle:'A slower kind of Kyoto itinerary.', paragraphs:['An itinerary can be a wonderful thing. It gets you out the door, points you toward a garden you might otherwise miss, and reminds you to book the things that matter. But some of the best hours on a trip belong to the space between plans.','In Kyoto, try giving yourself one completely open afternoon. Choose a neighborhood, leave the checklist behind, and follow what catches your attention: a doorway, the sound of a river, the promise of tea.','Pause before you reach for your phone. Sit somewhere for a while. Notice how a street changes as the light moves. You don’t need to find a hidden gem. An ordinary place, given your full attention, can be more than enough.','The practical part is simple: book your accommodation and any essential experiences, then protect a little empty space. Bring water, wear comfortable shoes, respect private areas, and know how to get home. The rest can wait.']},
    amalfi:{title:'A coast best discovered one village at a time',subtitle:'Less rushing. More sea air.',paragraphs:['It’s tempting to turn a coastline into a list. Three villages before lunch, another two by sunset, a quick photo at every turn. But the Amalfi Coast has a way of making a slower plan feel like the better one.','Choose a single base and let each day have one small destination. A garden. A harbor. A bakery someone mentioned over breakfast. If the ferries are running and conditions are good, seeing the coast from the water adds a whole new perspective.','Leave room for the ordinary pleasures: sitting in the shade, watching boats arrive, ordering something seasonal without rushing to the next stop. A place becomes more memorable when you give it time to feel familiar.','Check current ferry schedules before setting out, book accommodation ahead in busy periods, and keep an alternative for rough weather. A flexible day is a happier day.']},
    lisbon:{title:'In search of a very good pastry',subtitle:'Small rituals in a city of hills.',paragraphs:['There are many ways to get to know a city. Museums help. A good walking tour helps. But sometimes it begins with the same small order at the same neighborhood bakery, two mornings in a row.','In Lisbon, the pastel de nata makes a very good excuse to slow down. Find a café with room to sit, order something warm, and watch the neighborhood start its day. You don’t need to cross the city to find the internet’s most famous version.','After breakfast, walk without trying to cover too much ground. Follow a tiled street toward a viewpoint, duck into a little shop, and stop again when the hills ask you to. The best route is often the one with enough breaks.','Bring shoes with good grip, give residents space in narrow lanes, and treat a quiet neighborhood like someone’s home. Because it is.']}
  };
  const s=stories[id]; if(!s)return;
  document.querySelector('#story-content').innerHTML=`<img class="guide-hero" src="${d.image}" alt="Illustration inspired by ${d.name}"/><div class="guide-body story-body"><div class="eyebrow">THE ELSEWHERE JOURNAL · EDITORIAL DEMO</div><h2 id="story-title">${s.title}</h2><p class="guide-tagline">${s.subtitle}</p>${s.paragraphs.map(p=>`<p>${p}</p>`).join('')}<button class="button button-dark" data-guide="${id}">Explore ${d.name} ${icon('arrow')}</button></div>`;
  showDialog('story-dialog'); document.querySelector('#story-dialog').scrollTop=0;
}
renderDestinations();
if(!storageAvailable) notify('Browser storage is unavailable. Changes will last for this visit only.');

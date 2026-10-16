import test from 'node:test';
import assert from 'node:assert/strict';
import { destinations, filterDestinations, reviewSummary } from '../src/data.js';

test('search finds places by country and ignores surrounding whitespace and case', () => {
  assert.deepEqual(filterDestinations(destinations, {query:'  JAPAN  '}).map(d=>d.id), ['kyoto']);
  assert.equal(filterDestinations(destinations, {query:'nowhere'}).length, 0);
});
test('region, type, budget, and saved filters combine rather than replace each other', () => {
  assert.deepEqual(filterDestinations(destinations, {region:'Europe',type:'City breaks',budget:'Budget-friendly',savedOnly:true,saved:['lisbon','kyoto']}).map(d=>d.id), ['lisbon']);
  assert.equal(filterDestinations(destinations, {type:'Coast', budget:'Budget-friendly'}).length, 0);
  assert.equal(filterDestinations(destinations, {savedOnly:true}).length, 0);
});
test('ratings count exactly the displayed sample and locally submitted reviews', () => {
  const d=destinations[0];
  assert.deepEqual(reviewSummary(d), {count:1,rating:'4.9'});
  assert.deepEqual(reviewSummary(d,[{rating:1},{rating:3}]), {count:3,rating:'3.0'});
});

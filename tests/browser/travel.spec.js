import { test, expect } from '@playwright/test';

test('all bundled images load and the landing page has no JavaScript errors', async ({page}) => {
  const errors=[]; page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.destination-card')).toHaveCount(6);
  await page.evaluate(async ()=>{for(const image of document.images){image.loading='eager'; await image.decode();} await document.fonts.ready;});
  expect(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete && i.naturalWidth>0))).toBe(true);
  expect(errors).toEqual([]);
});

test('search, categories, budget, and empty-state reset work', async ({page}) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('Japan');
  await page.getByRole('button',{name:'Find my adventure'}).click();
  await expect(page.locator('.destination-card')).toHaveCount(1);
  await expect(page.locator('.destination-card h3')).toHaveText('Kyoto');
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByRole('button',{name:'Coast',exact:true}).click();
  await expect(page.locator('.destination-card h3')).toHaveText('Amalfi Coast');
  await page.getByLabel('Filter by budget').selectOption('Budget-friendly');
  await expect(page.getByRole('heading',{name:'A different path, perhaps?'})).toBeVisible();
  await page.getByRole('button',{name:'Explore all places'}).click();
  await expect(page.locator('.destination-card')).toHaveCount(6);
  await page.getByLabel('Filter by region').selectOption('Africa');
  await expect(page.locator('.destination-card h3')).toHaveText('Marrakech');
});

test('saved places persist after reload and can be removed', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Save Kyoto',exact:true}).click();
  await page.reload();
  await expect(page.getByRole('button',{name:'Unsave Kyoto',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.locator('#saved-nav').click();
  await expect(page.locator('.destination-card')).toHaveCount(1);
  await expect(page.locator('.destination-card h3')).toHaveText('Kyoto');
  await page.getByRole('button',{name:'Unsave Kyoto',exact:true}).click();
  await expect(page.locator('#empty-state')).toBeVisible();
});

test('guides show itinerary and reviews; dialogs close with Escape', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Read guide to The Dolomites'}).click();
  const dialog=page.locator('#guide-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading',{name:'A starting point for your trip'})).toBeVisible();
  await expect(dialog.getByText('Sample review · illustrative content')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button',{name:'Read guide to The Dolomites'})).toBeFocused();
});

test('reviews validate input, render safely, and survive reload', async ({page}) => {
  await page.goto('/');
  await page.locator('.header-review').click();
  const form=page.locator('#review-form');
  await form.getByLabel('Where did you go?').selectOption('kyoto');
  await form.getByLabel('Your name').fill('<b>Traveler</b>');
  await form.getByRole('radio',{name:'4 out of 5'}).check();
  await form.getByLabel('Your experience').fill('A peaceful walk and a wonderful cup of tea. <script>alert(1)</script>');
  await form.getByRole('button',{name:'Save my review'}).click();
  await expect(page.locator('#guide-dialog')).toBeVisible();
  await expect(page.locator('.review-list .review')).toHaveCount(2);
  await expect(page.locator('.review-list').getByText('<b>Traveler</b>',{exact:true})).toBeVisible();
  await expect(page.locator('.review-list script')).toHaveCount(0);
  await expect(page.locator('.reviews-heading')).toContainText('4.5');
  await page.reload();
  await page.getByRole('button',{name:'Read guide to Kyoto'}).click();
  await expect(page.locator('.review-list .review')).toHaveCount(2);
  await expect(page.locator('.review-list')).toContainText('Your local review');
});

test('journal articles and surprise destination open real content', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-story="lisbon"]').click();
  await expect(page.locator('#story-dialog')).toBeVisible();
  await expect(page.locator('#story-dialog').getByRole('heading',{name:'In search of a very good pastry'})).toBeVisible();
  await page.locator('#story-dialog').getByRole('button',{name:'Explore Lisbon'}).click();
  await expect(page.locator('#guide-title')).toHaveText('Lisbon');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Surprise me with a place'}).click();
  await expect(page.locator('#guide-dialog')).toBeVisible();
});

test('sorting changes the destination order', async ({page}) => {
  await page.goto('/');
  await page.getByLabel('Sort destinations').selectOption('name');
  await expect(page.locator('.destination-card h3').first()).toHaveText('Amalfi Coast');
});

test('mobile layout fits the viewport and supports the review workflow', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Read guide to Lisbon'}).click();
  await expect(page.locator('#guide-dialog')).toBeVisible();
  const box=await page.locator('#guide-dialog').boundingBox();
  expect(box.width).toBeLessThan(390);
  await page.locator('#guide-dialog').getByRole('button',{name:'Write a review'}).click();
  await expect(page.locator('#review-dialog')).toBeVisible();
  await expect(page.locator('#review-form select')).toHaveValue('lisbon');
});

test('review form rejects missing fields and whitespace-only content', async ({page}) => {
  await page.goto('/');
  await page.locator('.header-review').click();
  const form=page.locator('#review-form');
  await form.getByRole('button',{name:'Save my review'}).click();
  await expect(page.locator('#review-dialog')).toBeVisible();
  await form.getByLabel('Your name').fill('   ');
  await form.getByRole('radio',{name:'5 out of 5'}).check();
  await form.getByLabel('Your experience').fill('                    ');
  await form.getByRole('button',{name:'Save my review'}).click();
  await expect(page.locator('#review-dialog')).toBeVisible();
  expect(await form.evaluate(f=>f.checkValidity())).toBe(false);
  await form.getByLabel('Your name').fill('Traveler');
  await form.getByLabel('Your experience').fill('A lovely afternoon exploring the quiet gardens.');
  await form.getByRole('button',{name:'Save my review'}).click();
  await expect(page.locator('#guide-dialog')).toBeVisible();
});

test('saving a destination preserves keyboard focus', async ({page}) => {
  await page.goto('/');
  const save=page.getByRole('button',{name:'Save Kyoto',exact:true});
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button',{name:'Unsave Kyoto',exact:true})).toBeFocused();
});

test('unavailable browser storage does not break browsing or saving for the session', async ({page}) => {
  await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Disabled','QuotaExceededError')};});
  await page.goto('/');
  await page.getByRole('button',{name:'Save Kyoto',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Changes will last for this visit only');
  await page.locator('#saved-nav').click();
  await expect(page.locator('.destination-card h3')).toHaveText('Kyoto');
});

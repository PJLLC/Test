import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';

test('portable HTML renders with no network access, including images, guides, saved places, and reviews', async () => {
  const browser = await chromium.launch(existsSync('/usr/bin/chromium') ? {executablePath:'/usr/bin/chromium'} : {});
  try {
    const context = await browser.newContext({offline:true});
    const page = await context.newPage();
    const errors = [];
    const externalRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {if (/^https?:/.test(request.url())) externalRequests.push(request.url());});
    // This managed browser blocks file:// URLs by policy. Load the exact exported
    // HTML into a blank page instead, with all network connectivity disabled.
    await page.setContent(await readFile(resolve('dist/elsewhere.html'), 'utf8'));
    await expect(page.locator('.destination-card')).toHaveCount(6);
    await page.evaluate(async () => {
      for (const image of document.images) {image.loading='eager'; await image.decode();}
      await document.fonts.ready;
    });
    await page.getByRole('searchbox').fill('Japan');
    await expect(page.locator('.destination-card h3')).toHaveText('Kyoto');
    await page.getByRole('button', {name:'Save Kyoto',exact:true}).click();
    await expect(page.getByRole('button', {name:'Unsave Kyoto',exact:true})).toHaveAttribute('aria-pressed','true');
    await page.getByRole('button', {name:'Read guide to Kyoto'}).click();
    await expect(page.locator('#guide-dialog')).toBeVisible();
    await page.locator('#guide-dialog').getByRole('button', {name:'Write a review'}).click();
    const form=page.locator('#review-form');
    await form.getByLabel('Your name').fill('Offline traveler');
    await form.getByRole('radio', {name:'5 out of 5'}).check();
    await form.getByLabel('Your experience').fill('A wonderful afternoon in the temple gardens.');
    await form.getByRole('button', {name:'Save my review'}).click();
    await expect(page.locator('.review-list .review')).toHaveCount(2);
    await page.keyboard.press('Escape');
    await page.locator('[data-story="lisbon"]').click();
    await expect(page.locator('#story-dialog')).toBeVisible();
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, []);
  } finally {
    await browser.close();
  }
});

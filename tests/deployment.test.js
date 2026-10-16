import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium, expect } from '@playwright/test';

test('production build works under the GitHub Pages repository subdirectory', async () => {
  const browser = await chromium.launch(existsSync('/usr/bin/chromium') ? {executablePath:'/usr/bin/chromium'} : {});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:1000}});
    const missing=[];
    const errors=[];
    page.on('pageerror', error=>errors.push(error.message));
    const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf'};
    // Intercept requests locally; no real domain, external hosting, or public
    // deployment is involved. Requests outside /Test/ must fail this check.
    await page.route('https://pages-preview.test/**', async route=>{
      const path=new URL(route.request().url()).pathname;
      if(!path.startsWith('/Test/')) {missing.push(path); await route.fulfill({status:404,body:'Incorrect base path'});return;}
      const relative=path.slice('/Test/'.length)||'index.html';
      try {await route.fulfill({body:await readFile(resolve('dist',relative)),contentType:types[extname(relative)]||'application/octet-stream'});}
      catch {missing.push(path);await route.fulfill({status:404,body:'Missing asset'});}
    });
    await page.goto('https://pages-preview.test/Test/');
    await expect(page.locator('.destination-card')).toHaveCount(6);
    await page.evaluate(async()=>{
      for(const image of document.images) {image.loading='eager';await image.decode();}
      await document.fonts.ready;
    });
    await page.getByRole('button',{name:'Read guide to Kyoto'}).click();
    await expect(page.locator('#guide-title')).toHaveText('Kyoto');
    await page.keyboard.press('Escape');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.screenshot({path:'/tmp/elsewhere-preview.png'});
    assert.deepEqual(missing,[]);
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
});

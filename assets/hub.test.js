// Run from the repo root with: node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const list = hub.slice(hub.indexOf('id="projects"'), hub.indexOf('</ul>', hub.indexOf('id="projects"')));
const links = [...list.matchAll(/<a href="([^"]+)"/g)].map(m => m[1]);

test('hub lists at least one project', () => {
    assert.ok(links.length > 0);
});

for (const href of links) {
    test(`hub entry ${href} is a local page that builds its breadcrumb`, () => {
        assert.match(href, /^[\w.-]+\/$/, 'entries link to a folder, like "name/"');
        const page = path.join(root, href, 'index.html');
        assert.ok(fs.existsSync(page), `${page} exists`);
        assert.match(fs.readFileSync(page, 'utf8'), /<script src="\.\.\/assets\/crumbs\.js"/);
    });
}

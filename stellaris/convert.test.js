// Run from the repo root with: node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Load data.js and convert.js the way the page does.
const ctx = {};
vm.createContext(ctx);
const src = ['data.js', 'convert.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n');
vm.runInContext(src + '\nthis.colorData = colorData; this.StellarisText = StellarisText;', ctx);
const { colorData, StellarisText: T } = ctx;

const byCode = new Map();
const byChar = new Map();
for (const c of colorData) {
    for (const ch of [c.char, ...c.alsoChar]) byChar.set(ch, c);
    for (const code of c.codes) byCode.set(code.toLowerCase(), c);
}
const lookup = { byCode, byChar };
const D = T.DC1;
const run = (s, opts) => T.convert(s, lookup, opts);

test('no two colors share a code or a Stellaris character', () => {
    const codes = colorData.flatMap(c => c.codes.map(x => x.toLowerCase()));
    const chars = colorData.flatMap(c => [c.char, ...c.alsoChar]);
    assert.strictEqual(JSON.stringify(codes.filter((x, i) => codes.indexOf(x) !== i)), '[]');
    assert.strictEqual(JSON.stringify(chars.filter((x, i) => chars.indexOf(x) !== i)), '[]');
});

test('plain names get no codes', () => {
    assert.strictEqual(run('Hello World').output, 'Hello World');
});

test('basic color and auto reset', () => {
    assert.strictEqual(run('{red}Hi').output, `${D}RHi${D}!`);
    assert.strictEqual(run('{red}Hi', { resetAtEnd: false }).output, `${D}RHi`);
});

test('old codes, case and raw chars map to the same output', () => {
    const a = run('{red}A{blue}B').output;
    assert.strictEqual(run('{R}A{CB}B').output, a);
    assert.strictEqual(run('{RED}A{Blue}B').output, a);
    assert.strictEqual(run('{§R}A{§B}B').output, a);
});

test('repeated colors are dropped with a warning', () => {
    const r = run('{red}A{red}B{reset}');
    assert.strictEqual(r.output, `${D}RAB${D}!`);
    assert.match(r.warnings.join(), /repeats/);
});

test('overridden codes are dropped', () => {
    const r = run('{red}{blue}A{reset}');
    assert.strictEqual(r.output, `${D}BA${D}!`);
    assert.match(r.warnings.join(), /overridden/);
});

test('stray resets are dropped', () => {
    const r = run('{reset}A{reset}');
    assert.strictEqual(r.output, 'A');
    assert.match(r.warnings.join(), /no color to reset/);
});

test('reset-then-same-color is merged across spaces', () => {
    assert.strictEqual(run('{red}My{reset} {red}Ship').output, `${D}RMy Ship${D}!`);
});

test('codes after the last text are dropped unless they return to default', () => {
    assert.strictEqual(run('A{red}', { resetAtEnd: false }).output, 'A');
});

test('missing reset is warned about when auto reset is off', () => {
    assert.match(run('{red}A', { resetAtEnd: false }).warnings.join(), /without \{reset\}/);
});

test('minify off keeps every code', () => {
    assert.strictEqual(run('{red}A{red}B', { minify: false }).output, `${D}RA${D}RB${D}!`);
});

test('minified output always shows the same colors as the input', () => {
    const names = ['{red}a{blue}b{reset}c', '{red}a{blue}b{reset}c{reset}d', '{green}x {green}y{yellow}{yellow}z',
        '{reset}{reset}{red}{red}q{reset}{reset}', 'a{red}b{blue}c{red}d{reset}e', '{red}a{blue}b{red}c{reset}{reset}d'];
    const parts = ['{red}', '{blue}', '{green}', '{reset}', 'a', 'b', ' '];
    let seed = 42;
    const rand = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
    for (let i = 0; i < 3000; i++) {
        let s = '';
        for (let j = 0, len = 1 + rand(12); j < len; j++) s += parts[rand(parts.length)];
        names.push(s);
    }
    for (const n of names) for (const resetAtEnd of [true, false]) {
        const raw = run(n, { minify: false, resetAtEnd }).output;
        const min = run(n, { resetAtEnd }).output;
        assert.strictEqual(T.visibleColors(min, lookup), T.visibleColors(raw, lookup), n);
        assert.ok(min.length <= raw.length, n);
    }
});

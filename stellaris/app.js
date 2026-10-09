// Stellaris color name helper and console command reference.
// Data (ship_names, colorData) lives in data.js.

const MAX_LENGTH_NAME = 32;
const DC1_CHAR = '\u0011'; // Stellaris' color control character
const STORAGE_KEY = 'stellaris-helper';
const BUILTIN_LIST_ID = 'builtin';

const $ = (id) => document.getElementById(id);
const inputEl = $('input');
const outputEl = $('output');
const previewEl = $('preview');
const addResetCheckbox = $('add-reset');
const minifyCheckbox = $('minify');
const lengthInfoEl = $('length-info');
const meterEl = $('meter');
const generateNameButton = $('generate-name');
const listSelect = $('name-list');
const listEditor = $('list-editor');

function el(type, props = {}, ...children) {
    const node = Object.assign(document.createElement(type), props);
    node.append(...children);
    return node;
}

// ---- color lookup ----

// Builds the code and character lookups, and reports any code or Stellaris character
// claimed by two colors. Duplicates used to make one color silently replace another.
function buildLookup(colors) {
    const byCode = new Map();
    const byChar = new Map();
    const problems = [];
    for (const c of colors) {
        for (const ch of [c.char, ...c.alsoChar]) {
            if (byChar.has(ch)) problems.push(`Stellaris character "${ch}" is used by both ${byChar.get(ch).color} and ${c.color}.`);
            else byChar.set(ch, c);
        }
        for (const code of c.codes) {
            const key = code.toLowerCase();
            if (!/^[a-z0-9_-]+$/.test(key)) problems.push(`Code {${code}} (${c.color}) may only use letters, digits, _ and -.`);
            if (byCode.has(key)) problems.push(`Code {${code}} is used by both ${byCode.get(key).color} and ${c.color}.`);
            else byCode.set(key, c);
        }
    }
    return { byCode, byChar, problems };
}

const lookup = buildLookup(colorData);
const RESET = lookup.byChar.get('!');
const codeOf = (color) => `{${color.codes[0]}}`;

// Converts a name with the current options. See convert.js for what gets minified.
function convert(text) {
    return StellarisText.convert(text, lookup, { resetAtEnd: addResetCheckbox.checked, minify: minifyCheckbox.checked });
}

// ---- storage (best effort; private windows may block it) ----

const state = { input: '', addReset: true, minify: true, lists: [], selectedList: BUILTIN_LIST_ID };

function load() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        if (typeof saved.input === 'string') state.input = saved.input;
        if (typeof saved.addReset === 'boolean') state.addReset = saved.addReset;
        if (typeof saved.minify === 'boolean') state.minify = saved.minify;
        if (Array.isArray(saved.lists)) {
            state.lists = saved.lists.filter(l => l && typeof l.id === 'string' && typeof l.name === 'string' && Array.isArray(l.names));
        }
        if (typeof saved.selectedList === 'string') state.selectedList = saved.selectedList;
    } catch { /* ignore */ }
}

function save() {
    state.input = inputEl.value;
    state.addReset = addResetCheckbox.checked;
    state.minify = minifyCheckbox.checked;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

// ---- toast ----

let toastTimer;
function toast(message, isError = false) {
    const t = $('toast');
    t.textContent = message;
    t.classList.toggle('error', isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

async function copyText(text, label = 'Copied to clipboard') {
    try {
        await navigator.clipboard.writeText(text);
        toast(label);
    } catch {
        toast('Could not copy to clipboard', true);
    }
}

// ---- color editor ----

function addTable() {
    const headers = ['Color', 'Code', 'Also works', 'Vanilla use', 'RGB', 'Stellaris char'];
    $('table-content').append(el('table', {},
        el('thead', {}, el('tr', {}, ...headers.map(h => el('th', { textContent: h })))),
        el('tbody', {}, ...colorData.map(c => el('tr', {},
            el('td', { className: 'color-name' }, el('span', { textContent: c.color, style: `color: ${c.rgb}` })),
            el('td', {}, el('code', { textContent: codeOf(c) })),
            el('td', { textContent: [...c.codes.slice(1).map(code => `{${code}}`), `{§${c.char}}`].join(' ') }),
            el('td', { textContent: c.vanillaUse }),
            el('td', { textContent: c.rgb || '-' }),
            el('td', { textContent: [c.char, ...c.alsoChar].join(' / ') })
        )))
    ));
}

function addChip(color) {
    const chip = el('button', {
        type: 'button',
        className: 'chip',
        title: `${codeOf(color)} - ${color.vanillaUse}`,
        onclick: () => insertCode(color)
    }, el('span', { className: 'swatch' }), color.color, el('span', { className: 'code', textContent: codeOf(color) }));
    if (color.rgb) chip.style.setProperty('--chip', color.rgb);
    const showUse = () => showColorUse(color);
    chip.addEventListener('mouseenter', showUse);
    chip.addEventListener('focus', showUse);
    $('color-buttons').append(chip);
}

// Shows what the game uses the hovered or focused color for.
function showColorUse(color) {
    const hint = $('color-use');
    hint.replaceChildren(
        el('span', { className: 'use-swatch', style: `color: ${color.rgb || 'inherit'}`, textContent: color.color }),
        ` ${codeOf(color)} · in game: ${color.vanillaUse}`
    );
}

// Inserts a code at the cursor, or wraps the selected text in code ... {reset}.
function insertCode(color) {
    const { selectionStart: start, selectionEnd: end, value } = inputEl;
    const selected = value.slice(start, end);
    const insert = selected && color !== RESET ? codeOf(color) + selected + codeOf(RESET) : codeOf(color);
    inputEl.value = value.slice(0, start) + insert + value.slice(end);
    inputEl.focus();
    const caret = start + insert.length;
    inputEl.setSelectionRange(caret, caret);
    update();
}

// Renders the output the way Stellaris would, greying out anything past the limit.
function renderPreview(output) {
    previewEl.replaceChildren();
    const stack = [];
    let color = '';
    let run = '';
    let runCut = false;

    const flush = () => {
        if (!run) return;
        previewEl.append(el('span', { textContent: run, className: runCut ? 'cut' : '', style: runCut ? '' : `color: ${color}` }));
        run = '';
    };

    for (let i = 0; i < output.length; i++) {
        const cut = i >= MAX_LENGTH_NAME;
        if (cut !== runCut) { flush(); runCut = cut; }
        if (output[i] === DC1_CHAR && i + 1 < output.length) {
            flush();
            const ch = output[++i];
            if (ch === '!') color = stack.pop() ?? '';
            else { stack.push(color); color = lookup.byChar.get(ch)?.rgb ?? color; }
            continue;
        }
        run += output[i];
    }
    flush();
}

function update() {
    const { output, unknown, warnings, saved } = convert(inputEl.value);
    outputEl.value = output;
    renderPreview(output);

    const n = output.length;
    const over = n > MAX_LENGTH_NAME;
    meterEl.classList.toggle('over', over);
    $('meter-bar').style.width = `${Math.min(100, (n / MAX_LENGTH_NAME) * 100)}%`;
    lengthInfoEl.classList.toggle('over', over);
    lengthInfoEl.textContent = over
        ? `${n}/${MAX_LENGTH_NAME} characters. Stellaris will cut off everything past ${MAX_LENGTH_NAME} (each color code counts as 2).`
        : `${n}/${MAX_LENGTH_NAME} characters (each color code counts as 2).`;

    const unknownEl = $('unknown-info');
    unknownEl.hidden = unknown.length === 0;
    unknownEl.textContent = `Unknown code${unknown.length > 1 ? 's' : ''} left as text: ${[...new Set(unknown)].join(' ')}`;

    const warnEl = $('minify-info');
    const notes = [...new Set(warnings)];
    warnEl.hidden = notes.length === 0;
    warnEl.replaceChildren(
        el('span', { textContent: minifyCheckbox.checked && saved > 0 ? `Removed codes that change nothing, saving ${saved} characters:` : 'Codes that change nothing:' }),
        el('ul', {}, ...notes.map(n => el('li', { textContent: n })))
    );
    save();
}

// ---- name lists ----

const builtinList = { id: BUILTIN_LIST_ID, name: 'Culture ship names (built-in)', names: ship_names };
const allLists = () => [builtinList, ...state.lists];
const currentList = () => allLists().find(l => l.id === state.selectedList) ?? builtinList;

// Names that fit once color codes are converted. Recomputed when the list changes.
let usableNames = [];
let remainingNames = [];

function refreshNamePool() {
    const list = currentList();
    usableNames = [...new Set(list.names.map(n => n.trim()).filter(Boolean))]
        .filter(name => convert(name).output.length <= MAX_LENGTH_NAME);
    remainingNames = [...usableNames];
    const skipped = list.names.filter(n => n.trim()).length - usableNames.length;
    $('list-info').textContent = `${usableNames.length} usable name${usableNames.length === 1 ? '' : 's'}` +
        (skipped > 0 ? `, ${skipped} skipped (duplicate or longer than ${MAX_LENGTH_NAME} characters).` : '.');
    generateNameButton.textContent = 'generate name';
}

function renderLists() {
    listSelect.replaceChildren(...allLists().map(l => el('option', { value: l.id, textContent: l.name })));
    const list = currentList();
    state.selectedList = list.id;
    listSelect.value = list.id;
    const builtin = list === builtinList;
    listEditor.value = list.names.join('\n');
    listEditor.readOnly = builtin;
    $('list-label').textContent = builtin
        ? 'names (built-in list, read-only; make a new list to add your own)'
        : `names in "${list.name}", one per line`;
    $('list-delete').disabled = builtin;
    refreshNamePool();
    save();
}

function addList(name, names) {
    const id = `list-${Date.now().toString(36)}`;
    state.lists.push({ id, name, names });
    state.selectedList = id;
    renderLists();
}

function generateName() {
    if (usableNames.length === 0) {
        toast(`No names in this list fit in ${MAX_LENGTH_NAME} characters`, true);
        return;
    }
    if (remainingNames.length === 0) remainingNames = [...usableNames];
    const [name] = remainingNames.splice(Math.floor(Math.random() * remainingNames.length), 1);
    generateNameButton.textContent = `generate name (${remainingNames.length}/${usableNames.length})`;
    inputEl.value = name;
    update();
}

function setupLists() {
    listSelect.addEventListener('change', () => { state.selectedList = listSelect.value; renderLists(); });

    listEditor.addEventListener('input', () => {
        const list = currentList();
        if (list === builtinList) return;
        list.names = listEditor.value.split('\n');
        refreshNamePool();
        save();
    });

    $('list-new').addEventListener('click', () => {
        const name = prompt('Name for the new list:', `My names ${state.lists.length + 1}`);
        if (!name || !name.trim()) return;
        addList(name.trim(), []);
        $('lists-pane').open = true;
        listEditor.focus();
    });

    $('list-delete').addEventListener('click', () => {
        const list = currentList();
        if (list === builtinList || !confirm(`Delete the list "${list.name}"?`)) return;
        state.lists = state.lists.filter(l => l !== list);
        state.selectedList = BUILTIN_LIST_ID;
        renderLists();
    });

    const fileInput = $('list-file');
    $('list-import').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        fileInput.value = '';
        if (!file) return;
        const names = (await file.text()).split(/\r?\n/).map(n => n.trim()).filter(Boolean);
        addList(file.name.replace(/\.txt$/i, ''), names);
        $('lists-pane').open = true;
        toast(`Imported ${names.length} names`);
    });

    $('list-export').addEventListener('click', () => {
        const list = currentList();
        const blob = new Blob([list.names.join('\n') + '\n'], { type: 'text/plain' });
        const a = el('a', { href: URL.createObjectURL(blob), download: `${list.name.replace(/[^\w -]+/g, '').trim() || 'names'}.txt` });
        a.click();
        URL.revokeObjectURL(a.href);
    });
}

// ---- console commands ----

function setupCommands() {
    document.querySelectorAll('.command pre').forEach(pre => {
        const wrap = el('div', { className: 'code-block' });
        pre.replaceWith(wrap);
        wrap.append(pre, el('button', {
            type: 'button',
            className: 'btn small',
            textContent: 'copy',
            onclick: () => copyText(pre.textContent.trim().replace(/\s+/g, ' '), 'Command copied')
        }));
    });

    const search = $('command-search');
    search.addEventListener('input', () => {
        const terms = search.value.toLowerCase().split(/\s+/).filter(Boolean);
        let shown = 0;
        document.querySelectorAll('.command').forEach(cmd => {
            const text = cmd.textContent.toLowerCase();
            const match = terms.every(t => text.includes(t));
            cmd.hidden = !match;
            if (match) shown++;
        });
        $('no-results').hidden = shown > 0;
    });
}

// ---- tabs (driven by the URL hash so each tab is linkable) ----

const tabs = [...document.querySelectorAll('.tab')];

function showTab() {
    const id = location.hash.slice(1);
    const active = tabs.find(t => t.hash === `#${id}`) ?? tabs[0];
    tabs.forEach(t => {
        const on = t === active;
        t.setAttribute('aria-selected', on);
        $(t.getAttribute('aria-controls')).hidden = !on;
    });
}

tabs.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', t.hash);
    showTab();
}));
window.addEventListener('hashchange', showTab);

// ---- keyboard shortcuts ----

document.addEventListener('keydown', (e) => {
    const typing = e.target.matches('input, textarea, select');
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !$('colors').hidden && e.target !== listEditor) {
        e.preventDefault();
        copyText(outputEl.value);
        return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === '1' || e.key === '2') tabs[+e.key - 1].click();
    else if (e.key === '/') {
        e.preventDefault();
        tabs[1].click();
        $('command-search').focus();
    }
});

// ---- init ----

function init() {
    if (lookup.problems.length) {
        console.error('Color data problems:\n' + lookup.problems.join('\n'));
        $('data-error').hidden = false;
        $('data-error').textContent = 'Color data has conflicts, so some codes may give the wrong color:\n' + lookup.problems.join('\n');
    }

    addTable();
    colorData.forEach(addChip);
    setupCommands();

    load();
    inputEl.value = state.input;
    addResetCheckbox.checked = state.addReset;
    minifyCheckbox.checked = state.minify;

    inputEl.addEventListener('input', update);
    for (const box of [addResetCheckbox, minifyCheckbox]) box.addEventListener('change', () => { update(); refreshNamePool(); });
    generateNameButton.addEventListener('click', generateName);
    $('copy-to-clipboard').addEventListener('click', () => copyText(outputEl.value));
    $('clear-input').addEventListener('click', () => { inputEl.value = ''; inputEl.focus(); update(); });
    setupLists();

    showTab();
    update();
    renderLists();
}

init();

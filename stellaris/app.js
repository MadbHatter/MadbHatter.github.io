// Stellaris color name helper and console command reference.
// Data (ship_names, colorData) lives in data.js.

const MAX_LENGTH_NAME = 32;
const DC1_CHAR = '\u0011'; // Stellaris' color control character
const STORAGE_KEY = 'stellaris-helper';
const RESET = colorData[colorData.length - 1];

const $ = (id) => document.getElementById(id);
const inputEl = $('input');
const outputEl = $('output');
const previewEl = $('preview');
const addResetCheckbox = $('add-reset');
const lengthInfoEl = $('length-info');
const meterEl = $('meter');
const generateNameButton = $('generate-name');

function el(type, props = {}, ...children) {
    const node = Object.assign(document.createElement(type), props);
    node.append(...children);
    return node;
}

// ---- storage (best effort; private windows may block it) ----

function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ input: inputEl.value, addReset: addResetCheckbox.checked }));
    } catch { /* ignore */ }
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
    const headers = ['Color', 'Code', 'Vanilla use', 'RGB', 'Stellaris char (do not use)'];
    $('table-content').append(el('table', {},
        el('thead', {}, el('tr', {}, ...headers.map(h => el('th', { textContent: h })))),
        el('tbody', {}, ...colorData.map(c => el('tr', {},
            el('td', { className: 'color-name' }, el('span', { textContent: c.color, style: `color: ${c.rgb}` })),
            el('td', {}, el('code', { textContent: c.code })),
            el('td', { textContent: c.vanillaUse }),
            el('td', { textContent: c.rgb || '-' }),
            el('td', { textContent: c.stellarisCode.join(' / ') })
        )))
    ));
}

function addChip(color) {
    const chip = el('button', {
        type: 'button',
        className: 'chip',
        title: `${color.code} - ${color.vanillaUse}`,
        onclick: () => insertCode(color)
    }, el('span', { className: 'swatch' }), color.color, el('span', { className: 'code', textContent: color.code }));
    if (color.rgb) chip.style.setProperty('--chip', color.rgb);
    $('color-buttons').append(chip);
}

// Inserts a code at the cursor, or wraps the selected text in code ... {RESET}.
function insertCode(color) {
    const { selectionStart: start, selectionEnd: end, value } = inputEl;
    const selected = value.slice(start, end);
    const insert = selected && color !== RESET ? color.code + selected + RESET.code : color.code;
    inputEl.value = value.slice(0, start) + insert + value.slice(end);
    inputEl.focus();
    const caret = start + insert.length;
    inputEl.setSelectionRange(caret, caret);
    update();
}

function toControlChars(input) {
    return colorData.reduce(
        (text, c) => text.replaceAll(c.code, DC1_CHAR + c.stellarisCode[0]),
        input
    );
}

const rgbByChar = new Map(colorData.flatMap(c => c.stellarisCode.map(ch => [ch, c.rgb])));

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
            else { stack.push(color); color = rgbByChar.get(ch) ?? color; }
            continue;
        }
        run += output[i];
    }
    flush();
}

function update() {
    const raw = inputEl.value + (addResetCheckbox.checked && inputEl.value ? RESET.code : '');
    const output = toControlChars(raw);
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
    save();
}

const shortNames = ship_names.filter(name => name.length <= MAX_LENGTH_NAME);
let remainingNames = [...shortNames];

function generateName() {
    if (remainingNames.length === 0) remainingNames = [...shortNames];
    const [name] = remainingNames.splice(Math.floor(Math.random() * remainingNames.length), 1);
    generateNameButton.textContent = `generate name (${remainingNames.length}/${shortNames.length})`;
    inputEl.value = name;
    update();
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
    const typing = e.target.matches('input, textarea');
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !$('colors').hidden) {
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
    addTable();
    colorData.forEach(addChip);
    setupCommands();

    const saved = load();
    if (typeof saved.input === 'string') inputEl.value = saved.input;
    if (typeof saved.addReset === 'boolean') addResetCheckbox.checked = saved.addReset;

    inputEl.addEventListener('input', update);
    addResetCheckbox.addEventListener('change', update);
    generateNameButton.addEventListener('click', generateName);
    $('copy-to-clipboard').addEventListener('click', () => copyText(outputEl.value));
    $('clear-input').addEventListener('click', () => { inputEl.value = ''; inputEl.focus(); update(); });

    showTab();
    update();
}

init();

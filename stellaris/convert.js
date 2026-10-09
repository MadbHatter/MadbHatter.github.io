// Turns {color} codes into Stellaris text and squeezes out every code that doesn't
// change what is shown. Names are capped at 32 characters and each code costs 2, so
// repeated colors, codes with no text after them and unneeded resets are dropped,
// with a warning for each, but an output is always produced.
//
// Color model (from the wiki): a color code pushes a color, and the reset code (§!)
// returns to the color before the last change. The bottom of the stack is the default
// color of whatever field the name is shown in.
//
// No DOM here, so the same file runs in the page and under `node --test`.

const StellarisText = (() => {
    const DC1 = '\u0011';
    const DEFAULT = '';
    const MAX_DEPTH = 4; // deepest nesting the minifier will build; real names need 1 or 2

    // Splits input into text characters and color operations.
    function parse(input, lookup) {
        const tokens = [];
        const unknown = [];
        const re = /\{([^{}\s]+)\}/g;
        let last = 0;
        const pushText = (s) => { for (const ch of s) tokens.push({ type: 'text', ch }); };
        for (const m of input.matchAll(re)) {
            pushText(input.slice(last, m.index));
            last = m.index + m[0].length;
            const key = m[1];
            let color = key.length === 2 && key[0] === '§' ? lookup.byChar.get(key[1]) : lookup.byCode.get(key.toLowerCase());
            if (!color) { unknown.push(m[0]); pushText(m[0]); continue; }
            tokens.push(color.char === '!' ? { type: 'reset', src: m[0] } : { type: 'color', color, src: m[0] });
        }
        pushText(input.slice(last));
        return { tokens, unknown };
    }

    // Plays the tokens like the game would: the color of every character, plus warnings
    // about codes that change nothing.
    function render(tokens) {
        const chars = [];
        const warnings = [];
        const stack = [];
        let color = DEFAULT;
        let pending = []; // codes since the last visible character

        const flushPending = (reason) => {
            for (const t of pending) warnings.push(`${t.src} ${reason}`);
            pending = [];
        };

        for (const t of tokens) {
            if (t.type === 'text') {
                if (t.ch.trim()) pending = [];
                chars.push({ ch: t.ch, color });
                continue;
            }
            if (t.type === 'color') {
                if (t.color.char === color) { warnings.push(`${t.src} repeats the color already in use`); continue; }
                flushPending('is overridden before any text uses it');
                stack.push(color);
                color = t.color.char;
                pending.push(t);
            } else {
                if (stack.length === 0) { warnings.push(`${t.src} has no color to reset`); continue; }
                flushPending('is reset before any text uses it');
                color = stack.pop();
            }
        }
        // Codes left after the last text only matter if they bring the color back to default.
        if (pending.length && color !== DEFAULT) flushPending('has no text after it');
        return { chars, warnings, depth: stack.length };
    }

    // Groups characters into runs of one color. Whitespace looks the same in any color,
    // so it joins whichever run it sits in instead of forcing a change.
    function segments(chars) {
        const segs = [];
        for (const { ch, color } of chars) {
            const top = segs[segs.length - 1];
            const blank = !ch.trim();
            if (!top) segs.push({ color, text: ch, wild: blank });
            else if (blank) top.text += ch;
            else if (top.wild || top.color === color) { top.color = color; top.text += ch; top.wild = false; }
            else segs.push({ color, text: ch, wild: false });
        }
        return segs;
    }

    // Finds the cheapest list of codes that shows every segment in its color, trying
    // every mix of resets and new colors (tiny search: names have only a few segments).
    function plan(segs, resetAtEnd) {
        let states = new Map([['', { stack: [], cost: 0, ops: [] }]]);
        const add = (map, stack, cost, ops) => {
            const key = stack.join(',');
            const cur = map.get(key);
            if (!cur || cost < cur.cost) map.set(key, { stack, cost, ops });
        };
        for (const seg of segs) {
            const next = new Map();
            for (const s of states.values()) {
                for (let k = 0; k <= s.stack.length; k++) {
                    const popped = s.stack.slice(0, s.stack.length - k);
                    const top = popped.length ? popped[popped.length - 1] : DEFAULT;
                    const resets = Array(k).fill('!');
                    if (top === seg.color) add(next, popped, s.cost + 2 * k, [...s.ops, ...resets, { text: seg.text }]);
                    else if (seg.color !== DEFAULT && popped.length < MAX_DEPTH) {
                        add(next, [...popped, seg.color], s.cost + 2 * k + 2, [...s.ops, ...resets, seg.color, { text: seg.text }]);
                    }
                }
            }
            states = next;
        }
        let best;
        for (const s of states.values()) {
            const extra = resetAtEnd ? s.stack.length : 0;
            const cost = s.cost + 2 * extra;
            if (!best || cost < best.cost) best = { cost, ops: [...s.ops, ...Array(extra).fill('!')] };
        }
        return best.ops;
    }

    function toOutput(ops) {
        return ops.map(op => typeof op === 'string' ? DC1 + op : op.text).join('');
    }

    // Plain conversion: every code becomes 2 characters, nothing removed.
    // The auto reset adds one reset per color still open, so the color returns to default.
    function convertRaw(tokens, resetAtEnd, depth) {
        const out = tokens.map(t => t.type === 'text' ? t.ch : DC1 + (t.type === 'reset' ? '!' : t.color.char)).join('');
        return out + (resetAtEnd ? (DC1 + '!').repeat(depth) : '');
    }

    // Returns { output, unknown, warnings, saved }.
    function convert(input, lookup, { resetAtEnd = true, minify = true } = {}) {
        const { tokens, unknown } = parse(input, lookup);
        const { chars, warnings, depth } = render(tokens);
        const raw = convertRaw(tokens, resetAtEnd, depth);
        if (!resetAtEnd && depth > 0) warnings.push('the name ends in a color without {reset}, so following text may be colored too');
        if (!minify) return { output: raw, unknown, warnings, saved: 0 };
        const output = toOutput(plan(segments(chars), resetAtEnd));
        return { output, unknown, warnings, saved: raw.length - output.length };
    }

    // The color of each visible character, for checking that minifying changed nothing.
    function visibleColors(output, lookup) {
        const tokens = [];
        for (let i = 0; i < output.length; i++) {
            if (output[i] === DC1 && i + 1 < output.length) {
                const ch = output[++i];
                tokens.push(ch === '!' ? { type: 'reset', src: '' } : { type: 'color', color: lookup.byChar.get(ch), src: '' });
            } else tokens.push({ type: 'text', ch: output[i] });
        }
        return render(tokens).chars.filter(c => c.ch.trim()).map(c => c.ch + c.color).join('|');
    }

    return { convert, visibleColors, DC1 };
})();

if (typeof module !== 'undefined') module.exports = StellarisText;

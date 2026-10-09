// Fills every .crumbs element with a ~/madbhatter/... path built from the page URL,
// each folder linking to itself, so the shown path always matches where you are.
// Also names hub entries marked data-auto-name after the folder they link to.
(() => {
    const ROOT = '~/madbhatter';
    const folders = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);

    for (const crumbs of document.querySelectorAll('.crumbs')) {
        const parts = [];
        let href = '/';
        parts.push(folders.length ? Object.assign(document.createElement('a'), { href, textContent: ROOT }) : ROOT);
        folders.forEach((folder, i) => {
            href += `${folder}/`;
            const name = decodeURIComponent(folder);
            parts.push('/', i === folders.length - 1 ? name : Object.assign(document.createElement('a'), { href, textContent: name }));
        });
        crumbs.replaceChildren(...parts);
    }

    for (const name of document.querySelectorAll('[data-auto-name]')) {
        const link = name.closest('a');
        if (!link) continue;
        const path = new URL(link.href).pathname.split('/').filter(Boolean);
        if (path.length) name.textContent = `${decodeURIComponent(path[path.length - 1])}/`;
    }
})();

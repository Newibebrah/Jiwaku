window.CMS.registerEditorComponent({
    id: 'align-left',
    label: 'Align Kiri',
    fields: [{ name: 'content', label: 'Teks', widget: 'text' }],
    pattern: /^<div class="align-left">\n?([\s\S]*?)\n?<\/div>$/ms,
    fromBlock: (match) => ({ content: match[1] ? match[1].trim() : '' }),
    toBlock: ({ content = '' }) => `<div class="align-left">\n${content}\n</div>`,
    toPreview: ({ content = '' }) => `<div style="text-align:left">${content}</div>`,
});

window.CMS.registerEditorComponent({
    id: 'align-center',
    label: 'Align Tengah',
    fields: [{ name: 'content', label: 'Teks', widget: 'text' }],
    pattern: /^<div class="align-center">\n?([\s\S]*?)\n?<\/div>$/ms,
    fromBlock: (match) => ({ content: match[1] ? match[1].trim() : '' }),
    toBlock: ({ content = '' }) => `<div class="align-center">\n${content}\n</div>`,
    toPreview: ({ content = '' }) => `<div style="text-align:center">${content}</div>`,
});

window.CMS.registerEditorComponent({
    id: 'align-right',
    label: 'Align Kanan',
    fields: [{ name: 'content', label: 'Teks', widget: 'text' }],
    pattern: /^<div class="align-right">\n?([\s\S]*?)\n?<\/div>$/ms,
    fromBlock: (match) => ({ content: match[1] ? match[1].trim() : '' }),
    toBlock: ({ content = '' }) => `<div class="align-right">\n${content}\n</div>`,
    toPreview: ({ content = '' }) => `<div style="text-align:right">${content}</div>`,
});

window.CMS.registerEditorComponent({
    id: 'align-justify',
    label: 'Align Rata',
    fields: [{ name: 'content', label: 'Teks', widget: 'text' }],
    pattern: /^<div class="align-justify">\n?([\s\S]*?)\n?<\/div>$/ms,
    fromBlock: (match) => ({ content: match[1] ? match[1].trim() : '' }),
    toBlock: ({ content = '' }) => `<div class="align-justify">\n${content}\n</div>`,
    toPreview: ({ content = '' }) => `<div style="text-align:justify">${content}</div>`,
});
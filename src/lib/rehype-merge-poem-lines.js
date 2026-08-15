import { visit } from 'unist-util-visit';

function hasBr(node) {
    return node.children.some((child) => child.type === 'element' && child.tagName === 'br');
}

function isWhitespace(node) {
    return node.type === 'text' && node.value.trim() === '';
}

export default function rehypeMergePoemLines() {
    return (tree) => {
        visit(tree, (node) => {
            if (!Array.isArray(node.children)) return;
            const children = node.children.filter((child) => !isWhitespace(child));
            const out = [];
            let i = 0;
            while (i < children.length) {
                const cur = children[i];
                if (cur.type === 'element' && cur.tagName === 'p' && !hasBr(cur)) {
                    const run = [cur];
                    let j = i + 1;
                    while (j < children.length && children[j].type === 'element' && children[j].tagName === 'p' && !hasBr(children[j])) {
                        run.push(children[j]);
                        j += 1;
                    }
                    if (run.length > 1) {
                        const merged = { type: 'element', tagName: 'p', properties: {}, children: [] };
                        run.forEach((p, idx) => {
                            if (idx > 0) {
                                merged.children.push({ type: 'element', tagName: 'br', properties: {}, children: [] });
                            }
                            merged.children.push(...p.children);
                        });
                        out.push(merged);
                        i = j;
                        continue;
                    }
                }
                out.push(cur);
                i += 1;
            }
            node.children = out;
        });
    };
}
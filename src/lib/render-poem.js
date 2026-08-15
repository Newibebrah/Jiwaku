import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeMergePoemLines from './rehype-merge-poem-lines.js';

const processor = unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMergePoemLines)
    .use(rehypeStringify);

export function renderPoemHtml(body) {
    const vfile = processor.processSync(body);
    return String(vfile);
}
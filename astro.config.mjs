import { defineConfig } from 'astro/config';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

export default defineConfig({
    site: 'https://jiwaku-ten.vercel.app',
    output: 'static',
    markdown: {
        remarkPlugins: [remarkBreaks],
        rehypePlugins: [rehypeRaw],
    },
});

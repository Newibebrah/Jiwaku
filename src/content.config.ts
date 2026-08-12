import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
    loader: glob({ pattern: 'site.md', base: './content' }),
    schema: z.object({
        title: z.string().default('JIWAKU'),
        tagline: z.string().default(''),
        description: z.string().default(''),
        footer_text: z.string().default(''),
        email: z.string().default(''),
        location: z.string().default(''),
        social: z.string().default(''),
    }),
});

const poems = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/poems' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        excerpt: z.string().default(''),
    }),
});

const writings = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/writings' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        excerpt: z.string().default(''),
    }),
});

const photos = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/photos' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        location: z.string().default(''),
        image: z.string(),
        caption: z.string().default(''),
    }),
});

export const collections = { site, poems, writings, photos };

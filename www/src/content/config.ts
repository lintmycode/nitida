import { defineCollection, z } from 'astro:content';

const worksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Short mono label shown beside the title on the work card (mockup's `sub`).
    subtitle: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    // Filter-chip keys on /works (ALL/WORDPRESS/SHOPIFY/SEO/BRAND/APPS).
    services: z.array(z.enum(['wordpress', 'shopify', 'seo', 'brand', 'apps'])),
    featured: z.boolean().optional(),
    order: z.number().optional(),
    image: z.string().optional(),
    backgroundPosition: z.string().optional(),
    link: z.array(z.string()).length(2).optional(),
  }),
});

export const collections = {
  works: worksCollection,
};
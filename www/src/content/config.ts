import { defineCollection, z } from 'astro:content';

const worksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean().optional(),
    order: z.number().optional(),
    image: z.string().optional(),
    backgroundPosition: z.string().optional(),
  }),
});

export const collections = {
  works: worksCollection,
};
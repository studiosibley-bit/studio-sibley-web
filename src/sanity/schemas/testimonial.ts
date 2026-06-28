import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Company',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      description: 'Number of stars to display (1–5).',
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5).integer(),
      options: {
        list: [1, 2, 3, 4, 5],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Controls the order testimonials appear on the homepage.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})

import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'aboutPhoto',
      title: 'About Photo',
      type: 'image',
      description: 'Your portrait photo shown on the About page.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroBg',
      title: 'Hero Background',
      type: 'image',
      description: 'Background image for the home page.',
    }),
    defineField({
      name: 'projectsBg',
      title: 'Projects Background',
      type: 'image',
      description: 'Background image for the Projects page.',
    }),
    defineField({
      name: 'servicesBg',
      title: 'Services Background',
      type: 'image',
      description: 'Background image for the Services page.',
    }),
    defineField({
      name: 'aboutBg',
      title: 'About Background',
      type: 'image',
      description: 'Background image for the About page.',
    }),
    defineField({
      name: 'connectBg',
      title: 'Connect Background',
      type: 'image',
      description: 'Background image for the Connect page.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})

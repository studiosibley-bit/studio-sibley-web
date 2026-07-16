import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'showTestimonials',
      title: 'Show testimonials on home page',
      type: 'boolean',
      description:
        'Turn the testimonials section on the home page on or off. Keep this OFF until you have real testimonials to show.',
      initialValue: false,
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright Year',
      type: 'number',
      description: 'Shown in the footer as "© [year] Studio Sibley." Update this once a year.',
      validation: (r) => r.min(2020).max(2100).integer(),
    }),
    defineField({
      name: 'aboutPhoto',
      title: 'About Photo',
      type: 'image',
      description: 'Your portrait photo shown at the top of the About page (the hero).',
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

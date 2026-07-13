import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'medium',
      title: 'Medium',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'Photo' },
          { title: 'Video', value: 'Video' },
          { title: 'Design', value: 'Design' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Photo: People · Products · Places  |  Video: Stories · Campaigns · Events  |  Design: Identity · Print · Digital',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Paste the YouTube link (e.g. https://www.youtube.com/watch?v=…). Only used for Video projects.',
    }),
    defineField({
      name: 'fullImages',
      title: 'Full-Size Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
      description: 'These display full-width stacked above the gallery grid.',
      hidden: ({ document }) => !!document?.featured || !!document?.isBooklet,
    }),
    defineField({
      name: 'isBooklet',
      title: 'Booklet (Page-Flip Viewer)',
      type: 'boolean',
      initialValue: false,
      description: 'Show this project as an interactive page-flip booklet using the spreads below, instead of the standard image gallery.',
    }),
    defineField({
      name: 'bookletSpreads',
      title: 'Booklet Spreads (Reading Order)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
      description:
        'Upload spreads in normal reading order, exactly as InDesign exports facing pages — no print-shop imposition needed. First image = cover spread (back cover on the left, front cover on the right). Every image after that = the next sequential facing-page spread (pages 2-3, then 4-5, then 6-7, and so on). The viewer splits each upload down the middle and pairs the true front/back of each page automatically.',
      hidden: ({ document }) => !document?.isBooklet,
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
      description: 'Show in the featured section on the projects page.',
    }),
    defineField({
      name: 'tileSize',
      title: 'Tile Size',
      type: 'string',
      initialValue: 'half',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Half Width', value: 'half' },
          { title: 'Third Width', value: 'third' },
        ],
        layout: 'radio',
      },
      description: 'Controls the size of this tile in the featured mosaic grid.',
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Background Video',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      description: 'Upload an MP4 to autoplay muted behind the title instead of the thumbnail image.',
      hidden: ({ document }) => !document?.featured,
    }),
    defineField({
      name: 'role',
      title: 'Your Role(s)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add each role separately, e.g. Photography, Art Direction',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'brief',
      title: 'Project Brief',
      type: 'text',
      rows: 3,
      description: 'Case study summary shown on the featured project page.',
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank to sort by date.',
    }),
  ],
  orderings: [
    { title: 'Sort Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Newest First', name: 'newest', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'medium', media: 'thumbnail' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media }
    },
  },
})

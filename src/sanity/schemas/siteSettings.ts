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
      name: 'aboutStoryText',
      title: 'About — Story Paragraph',
      type: 'text',
      rows: 3,
      description: 'The first paragraph on the About page, right below your name.',
      initialValue:
        'My passion for creating all started with making short films on an iPad, which quickly grew into filmmaking. In high school, I launched a photography business, offering prom and graduation portraits to classmates.',
    }),
    defineField({
      name: 'aboutTimelineStep1',
      title: 'About — Timeline Step 1',
      type: 'text',
      rows: 3,
      description:
        'Wrap any phrase in double curly braces, like {{this}}, to highlight it in gold — used for the icon-timeline paragraphs and the mission statement below.',
      initialValue:
        'Around that same time, a conversation with a family friend and graphic designer {{changed the direction}} of my creative journey. I was encouraged to create anything and everything.',
    }),
    defineField({
      name: 'aboutTimelineStep2',
      title: 'About — Timeline Step 2',
      type: 'text',
      rows: 3,
      description: 'Wrap a phrase in {{double curly braces}} to highlight it in gold.',
      initialValue:
        'That mindset led me to {{immerse myself}} in design, photography, and filmmaking. Over time, I developed an eye for what makes creative work effective and an understanding of its business value.',
    }),
    defineField({
      name: 'aboutTimelineStep3',
      title: 'About — Timeline Step 3',
      type: 'text',
      rows: 3,
      description: 'Wrap a phrase in {{double curly braces}} to highlight it in gold.',
      initialValue:
        'I also noticed that many businesses, organizations, and individuals were {{held back}} by visuals and marketing that failed to reflect the quality of what they offered.',
    }),
    defineField({
      name: 'aboutMissionText',
      title: 'About — Mission Statement',
      type: 'text',
      rows: 3,
      description: 'The highlighted card near the bottom of the About page. Wrap a phrase in {{double curly braces}} to highlight it in gold.',
      initialValue:
        'Studio Sibley was built to help entrepreneurs, musicians, nonprofits, churches, creators, and personal brands present themselves with the {{same care}} they put into what they do.',
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

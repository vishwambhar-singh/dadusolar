export const siteData = {
  company: {
    name: 'Dadu Solar',
    tagline: 'Smart Energy. Sustainable Future.',
    description: 'Reliable, efficient and future-ready solar solutions designed around real energy needs.',
  },
  contact: {
    phone: '9610235777',
    email: 'Contact@dadusolar.com',
    address: 'India',
  },
  stats: [
    ['10+', 'Years of industry experience'],
    ['500+', 'Installations'],
    ['10 MW+', 'Clean energy capacity'],
    ['95%', 'Customer satisfaction'],
  ],
  solutions: [
    { id: '01', title: 'Residential solar', short: 'Thoughtful rooftop systems for homes that want more control over energy.', text: 'A considered solar approach for residences, designed around usable roof area, consumption patterns and future flexibility.', icon: '⌂', image: '/manus-storage/dadu-residential-solar_a5a9da2f.jpg' },
    { id: '02', title: 'Commercial solar', short: 'Smarter energy infrastructure for ambitious commercial spaces.', text: 'From offices to campuses, we help businesses explore practical systems that support operating resilience and long-term planning.', icon: '▦', image: '/manus-storage/dadu-commercial-solar_dd848674.jpg' },
    { id: '03', title: 'Industrial solar', short: 'Engineered for scale, designed for operational reality.', text: 'Large-format solar solutions that place engineering, safety and maintainability at the center of every decision.', icon: '◫', image: '/manus-storage/dadu-industrial-solar_cc675c9b.jpg' },
    { id: '04', title: 'Rooftop solar', short: 'Turn overlooked surfaces into productive energy assets.', text: 'We translate available rooftop space into a clear, considered route toward cleaner electricity generation.', icon: '⌁', image: '/manus-storage/rooftop-engineer_d7fd5b6f.jpg' },
    { id: '05', title: 'Solar EPC & installation', short: 'One connected path from concept to commissioning.', text: 'Assessment, design coordination, component selection, installation and testing—aligned into one accountable workflow.', icon: '↗', image: '/manus-storage/dadu-solar-carport_92d22548.jpg' },
    { id: '06', title: 'Operations & maintenance', short: 'Keep every system visible, supported and ready to perform.', text: 'Ongoing monitoring and structured maintenance that keeps the system aligned with its original intent.', icon: '◌', image: '/manus-storage/dadu-om-solar_dbce8aa5.jpg' },
  ],
  projects: [
    { title: 'Industrial rooftop programme', category: 'Industrial', location: 'India · high-demand operations', capacity: 'Designed around site load', description: 'A reference profile for a large rooftop system where safety, maintainability and operating continuity shape every design decision.', image: '/manus-storage/solar-farm_fd8a66e0.jpg' },
    { title: 'Commercial rooftop installation', category: 'Commercial', location: 'India · working campus', capacity: 'Aligned to daytime demand', description: 'A practical rooftop approach planned around the rhythm of a working building, with clear coordination from survey through commissioning.', image: '/manus-storage/dadu-solar-school_85487c5f.jpg' },
    { title: 'Residential solar project', category: 'Residential', location: 'India · modern home', capacity: 'Scaled to household use', description: 'A compact, design-aware system that turns available roof area into a calmer, more self-directed energy experience.', image: '/manus-storage/residential-roof_f1448143.jpg' },
    { title: 'Institutional solar deployment', category: 'Commercial', location: 'India · community facility', capacity: 'Built for dependable use', description: 'A solar approach balancing visible impact with dependable operation, straightforward maintenance and a clear handover.', image: '/manus-storage/dadu-solar-battery_03840d4c.jpg' },
    { title: 'Large-scale solar installation', category: 'Industrial', location: 'India · open-site generation', capacity: 'Planned for future scale', description: 'A large-format reference profile focused on thoughtful siting, coordinated delivery and long-term system visibility.', image: '/manus-storage/solar-field_fdeeeb65.jpg' },
  ],
};

export type Solution = typeof siteData.solutions[number];
export type Project = typeof siteData.projects[number];

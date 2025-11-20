export const DESIGN_CONSTANTS = {
  borderRadius: {
    card: 'rounded-xl',
    input: 'rounded-lg',
    button: 'rounded-lg',
  },
  padding: {
    card: 'p-8',
    input: 'px-4 py-3',
    button: 'px-6 py-3',
  },
  shadow: {
    card: 'shadow-lg',
    button: 'shadow-md',
  },
  glass: {
    card: 'bg-white/10 backdrop-blur-md border border-white/20',
    input: 'bg-white/5 backdrop-blur-sm border border-white/10',
  },
  colors: {
    primary: 'bg-neutral-800 hover:bg-neutral-900 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-neutral-800 dark:text-white',
  },
  transition: 'transition-all duration-200',
} as const;

export const BRAND = {
  name: 'Connectify',
  tagline: 'Stay connected to your campus.',
} as const;



export const PREDEFINED_TAGS = [
  "Announcement",
  "Event",
  "LostAndFound",
  "Help",
  "Placement",
  "Doubt",
  "Resource",
  "Achievement",
  "Update",
  "Workshop",
  "Hackathon",
  "Exam",
  "General",
];


export const PREDEFINED_COMMUNITY_TAGS = [
  "Academic",
  "Technical",
  "Cultural",
  "Sports",
  "Arts",
  "Clubs",
  "Career",
  "Events",
  "Social",
  "Support",
  "Research",
  "Innovation",
  "General",
];

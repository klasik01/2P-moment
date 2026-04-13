// Typy pro 2P Stavební admin sekci

export type ProjectImage = {
  src: string;
  alt?: string;
  storagePath?: string;
  hidden?: boolean;
  isPrimary?: boolean;
  useInHero?: boolean;
};

export type Project = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  location?: string;
  hidden?: boolean;
  images: ProjectImage[];
};

export type StavebniPromotion = {
  id: string;
  enabled: boolean;
  startsAt?: string;
  endsAt?: string;
  badge: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

export type TeamMember = {
  name: string;
  role: string;
  phone: string;
  email: string;
  initials: string;
};

export type StavebniManagedContent = {
  projects: Project[];
  promotions: StavebniPromotion[];
  team: TeamMember[];
};

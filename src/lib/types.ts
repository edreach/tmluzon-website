export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Specification = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  specifications: Specification[];
  type: string;
  brand: string;
  subType: string;
  discontinued?: boolean;
};

export type Review = {
  id: string;
  author: string;
  avatar: ImagePlaceholder;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Service = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type UserProfile = {
    uid: string;
    name: string;
    email: string;
}

export type AdminRole = {
    id: string;
    uid: string;
}

export type AboutUsContent = {
  intro_p1: string;
  intro_p2: string;
  intro_p3: string;
  overview_p1: string;
  service_consultation: string;
  service_supply: string;
  service_supply_list: string; // newlines
  service_installation: string;
  service_maintenance: string;
  statement_purpose: string;
  statement_vision: string;
  statement_mission: string;
};

export type SiteSettings = {
    logoUrl?: string;
    aboutUsContent?: AboutUsContent;
}

export type PricelistData = {
  brand: string;
  title: string;
  fileName: string;
  fileUrl: string;
};

export type PricelistFile = PricelistData & { id: string };

export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
};

export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  imageHint?: string;
};

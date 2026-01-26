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

export type ProductData = {
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  specifications: Specification[];
  type: string;
  brand: string;
  subType: string;
  discontinued?: boolean;
  stockStatus?: 'In Stock' | 'Out of Stock' | 'Made to Order';
  showPrice?: boolean;
};
export type Product = ProductData & { id: string };

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

export type ServiceData = {
  name: string;
  description: string;
  imageUrls: string[];
};
export type Service = ServiceData & { id: string };

export type UserProfile = {
    uid: string;
    name: string;
    email: string;
}

export type AdminRole = {
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
export type PricelistFile = {
  id: string;
  brand: string;
  title: string;
  fileName: string;
  fileUrl: string;
};

export type NewsArticleData = {
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
};
export type NewsArticle = NewsArticleData & { id: string };

export type BrandData = {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  imageHint?: string;
  sortOrder?: number;
};
export type Brand = BrandData & { id: string };

    

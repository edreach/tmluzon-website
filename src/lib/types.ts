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

export type SiteSettings = {
    logoUrl?: string;
    aboutUsContent?: string;
}

export type PricelistFile = {
  id: string;
  brand: string;
  title: string;
  fileName: string;
  fileUrl: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
};

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
  images: ImagePlaceholder[];
  specifications: Specification[];
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

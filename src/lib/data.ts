import type { Product, Review } from './types';

export const product: Product = {
  id: 'aero-lamp-1',
  name: 'Aero Minimalist Lamp',
  price: 129.00,
  description: 'The Aero Minimalist Lamp combines sleek design with functional elegance. Crafted from premium aluminum with a matte teal finish, it provides a warm, ambient light perfect for any modern living space or office. Its intuitive touch controls and energy-efficient LED make it both beautiful and smart.',
  images: [
    {
      "id": "lamp-1",
      "description": "A modern teal lamp on a wooden table.",
      "imageUrl": "https://picsum.photos/seed/lamp1/800/800",
      "imageHint": "modern lamp"
    },
    {
      "id": "lamp-2",
      "description": "Close-up of the lamp's texture and material.",
      "imageUrl": "https://picsum.photos/seed/lamp2/800/800",
      "imageHint": "lamp texture"
    },
    {
      "id": "lamp-3",
      "description": "The lamp illuminating a cozy living room corner.",
      "imageUrl": "https://picsum.photos/seed/lamp3/800/800",
      "imageHint": "living room"
    },
    {
      "id": "lamp-4",
      "description": "The lamp from a different angle, showing its sleek profile.",
      "imageUrl": "https://picsum.photos/seed/lamp4/800/800",
      "imageHint": "sleek lamp"
    }
  ],
  specifications: [
    { name: 'Material', value: 'Anodized Aluminum, Polycarbonate Diffuser' },
    { name: 'Dimensions', value: '15" H x 6" W x 6" D' },
    { name: 'Weight', value: '2.5 lbs' },
    { name: 'Light Source', value: 'Integrated LED' },
    { name: 'Color Temperature', value: '2700K (Warm White)' },
    { name: 'Power', value: '8W' },
    { name: 'Cord Length', value: '6 ft' },
  ],
};

export const reviews: Review[] = [
  {
    id: 'review-1',
    author: 'Sarah J.',
    rating: 5,
    title: 'Absolutely stunning!',
    comment: 'This lamp is the perfect addition to my home office. The design is beautiful and the light is so warm and inviting. Worth every penny!',
    date: 'July 15, 2024',
    avatar: {
      "id": "avatar-1",
      "description": "Avatar for Sarah J.",
      "imageUrl": "https://picsum.photos/seed/avatar1/40/40",
      "imageHint": "person portrait"
    },
  },
  {
    id: 'review-2',
    author: 'Michael B.',
    rating: 5,
    title: 'Sleek and Functional',
    comment: 'I love the minimalist aesthetic. It fits perfectly on my nightstand and the dimmer function is great for evening reading. Highly recommend.',
    date: 'July 10, 2024',
    avatar: {
      "id": "avatar-2",
      "description": "Avatar for Michael B.",
      "imageUrl": "https://picsum.photos/seed/avatar2/40/40",
      "imageHint": "man face"
    },
  },
  {
    id: 'review-3',
    author: 'Emily K.',
    rating: 4,
    title: 'Great lamp, slight issue',
    comment: 'Beautiful lamp and build quality is excellent. The cord could be a little longer, but otherwise, it\'s fantastic. Looks very high-end.',
    date: 'June 28, 2024',
    avatar: {
      "id": "avatar-3",
      "description": "Avatar for Emily K.",
      "imageUrl": "https://picsum.photos/seed/avatar3/40/40",
      "imageHint": "woman smiling"
    },
  },
];

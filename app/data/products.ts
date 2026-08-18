export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: "Made to order" | "Limited stock";
  price: number;
  image: string;
  imageAlt: string;
};

const temporaryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Temporary stock photo of colourful flowers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Temporary stock photo of green botanical décor",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Temporary stock photo of a floral arrangement",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Temporary stock photo of handmade-inspired flowers",
  },
];

export const products: Product[] = [
  {
    id: "hibiscus-mala",
    name: "Hibiscus flower mala",
    category: "Garlands & malas",
    description: "A cheerful handmade flower garland for pooja, décor, and gifting.",
    availability: "Made to order",
    price: 499,
    ...temporaryImages[0],
  },
  {
    id: "jasmine-mala",
    name: "Jasmine flower mala",
    category: "Garlands & malas",
    description: "A soft floral garland inspired by classic jasmine blooms.",
    availability: "Made to order",
    price: 449,
    ...temporaryImages[2],
  },
  {
    id: "floral-necklace",
    name: "Floral necklace",
    category: "Floral necklaces",
    description: "A playful statement necklace made from tiny handmade flowers.",
    availability: "Limited stock",
    price: 599,
    ...temporaryImages[3],
  },
  {
    id: "lotus-night-lamp",
    name: "Lotus LED night lamp",
    category: "LED night lamps",
    description: "A gentle floral light that makes evening corners glow warmly.",
    availability: "Made to order",
    price: 899,
    ...temporaryImages[0],
  },
  {
    id: "shree-rangoli",
    name: "Shree woolen rangoli",
    category: "Pooja & festival décor",
    description: "A bright handmade accent for festive, pooja, and welcome spaces.",
    availability: "Made to order",
    price: 699,
    ...temporaryImages[2],
  },
  {
    id: "flower-keychain",
    name: "Flower keychain",
    category: "Keychains",
    description: "A small handmade bloom to carry on keys, bags, or gift tags.",
    availability: "Limited stock",
    price: 199,
    ...temporaryImages[3],
  },
  {
    id: "flower-hairband",
    name: "Flower hairband",
    category: "Hair accessories",
    description: "A joyful floral hair accessory for little celebrations and everyday play.",
    availability: "Made to order",
    price: 249,
    ...temporaryImages[1],
  },
  {
    id: "sunflower-bouquet",
    name: "Sunflower bouquet",
    category: "Flower bouquets",
    description: "A lasting bundle of pipe-cleaner sunflowers for a thoughtful gift.",
    availability: "Made to order",
    price: 799,
    ...temporaryImages[0],
  },
  {
    id: "flower-pot-decor",
    name: "Flower pot décor",
    category: "Flower pot décor",
    description: "A cheerful everlasting arrangement for desks, shelves, and side tables.",
    availability: "Limited stock",
    price: 549,
    ...temporaryImages[1],
  },
  {
    id: "floral-toran",
    name: "Floral door toran",
    category: "Home details",
    description: "A welcoming handmade hanging for doors, walls, and festive corners.",
    availability: "Made to order",
    price: 999,
    ...temporaryImages[2],
  },
  {
    id: "crochet-pen-holder",
    name: "Crochet pen holder",
    category: "Home details",
    description: "A practical desk detail with a soft handmade finish.",
    availability: "Limited stock",
    price: 349,
    ...temporaryImages[1],
  },
  {
    id: "decorated-phone-case",
    name: "Decorated phone case",
    category: "Phone cases",
    description: "A personalised handmade touch for the device you use every day.",
    availability: "Made to order",
    price: 599,
    ...temporaryImages[3],
  },
];

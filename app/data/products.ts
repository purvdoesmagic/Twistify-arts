export type ProductAvailability = "In stock" | "Made to order" | "Sold out";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: ProductAvailability;
  price: number;
  image: string;
  images: string[];
  imageAlt: string;
};

const temporaryImages = [
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=1000&q=80",
];

type ProductDraft = Omit<Product, "image" | "images" | "imageAlt">;

function product(draft: ProductDraft, imageIndex: number): Product {
  return {
    ...draft,
    image: temporaryImages[imageIndex % temporaryImages.length],
    images: temporaryImages,
    imageAlt: `Temporary placeholder for ${draft.name}`,
  };
}

const handmade = "Handmade with care for gifting, festivals, pooja, and joyful home corners.";

export const products: Product[] = [
  product({ id: "red-hibiscus-garland", name: "Red hibiscus garland", category: "Flower garlands & malas", description: handmade, availability: "Made to order", price: 499 }, 0),
  product({ id: "white-jasmine-garland", name: "White jasmine garland", category: "Flower garlands & malas", description: handmade, availability: "Made to order", price: 449 }, 2),
  product({ id: "leaf-flower-garland", name: "Green leaf with flowers garland", category: "Flower garlands & malas", description: handmade, availability: "In stock", price: 549 }, 1),

  product({ id: "rose-floral-necklace", name: "Rose floral necklace", category: "Floral necklaces", description: handmade, availability: "Made to order", price: 599 }, 3),
  product({ id: "jasmine-floral-necklace", name: "Jasmine floral necklace", category: "Floral necklaces", description: handmade, availability: "In stock", price: 549 }, 2),

  product({ id: "lotus-glow-lamp", name: "Lotus glow lamp", category: "LED flower night lamps", description: handmade, availability: "Made to order", price: 899 }, 0),
  product({ id: "sunflower-elegance-lamp", name: "Sunflower elegance lamp", category: "LED flower night lamps", description: handmade, availability: "In stock", price: 949 }, 3),
  product({ id: "golden-daisy-lamp", name: "Golden daisy lamp", category: "LED flower night lamps", description: handmade, availability: "Made to order", price: 999 }, 2),

  product({ id: "swastik-wall-hanging", name: "Swastik wall hanging", category: "Pooja & festival wall decor", description: handmade, availability: "Made to order", price: 699 }, 2),
  product({ id: "shree-wall-hanging", name: "Shree wall hanging", category: "Pooja & festival wall decor", description: handmade, availability: "In stock", price: 749 }, 0),
  product({ id: "woolen-rangoli", name: "Woolen rangoli", category: "Pooja & festival wall decor", description: handmade, availability: "Made to order", price: 799 }, 3),

  product({ id: "flower-keychain", name: "Flower keychain", category: "Keychains", description: handmade, availability: "In stock", price: 199 }, 3),
  product({ id: "cherry-keychain", name: "Cherry keychain", category: "Keychains", description: handmade, availability: "Made to order", price: 179 }, 0),
  product({ id: "watermelon-keychain", name: "Watermelon keychain", category: "Keychains", description: handmade, availability: "Sold out", price: 179 }, 1),

  product({ id: "sunflower-hairband", name: "Sunflower hairband", category: "Hair accessories", description: handmade, availability: "Made to order", price: 249 }, 0),
  product({ id: "bumblebee-hairband", name: "Bumblebee hairband", category: "Hair accessories", description: handmade, availability: "In stock", price: 269 }, 1),
  product({ id: "bunny-ear-hairband", name: "Bunny ear hairband", category: "Hair accessories", description: handmade, availability: "Made to order", price: 299 }, 3),
  product({ id: "flower-hair-clips", name: "Flower hair clips", category: "Hair accessories", description: handmade, availability: "In stock", price: 149 }, 2),

  product({ id: "sunflower-bouquet", name: "Sunflower bouquet", category: "Flower bouquets", description: handmade, availability: "Made to order", price: 499 }, 0),
  product({ id: "lavender-bouquet", name: "Lavender bouquet", category: "Flower bouquets", description: handmade, availability: "Made to order", price: 349 }, 3),
  product({ id: "iris-bouquet", name: "Iris bouquet", category: "Flower bouquets", description: handmade, availability: "In stock", price: 449 }, 2),
  product({ id: "tulip-bouquet", name: "Tulip bouquet", category: "Flower bouquets", description: "A joyful handmade tulip bouquet, starting at ₹149.", availability: "Made to order", price: 149 }, 1),

  product({ id: "sunflower-pot-decor", name: "Sunflower pot decor", category: "Flower pot decor", description: handmade, availability: "In stock", price: 549 }, 0),
  product({ id: "mini-flower-pot", name: "Mini flower pot decor", category: "Flower pot decor", description: handmade, availability: "Made to order", price: 299 }, 2),

  product({ id: "crochet-pen-holder", name: "Crochet pen holder", category: "Pen holders & curtain holders", description: handmade, availability: "In stock", price: 349 }, 1),
  product({ id: "floral-curtain-holder", name: "Floral curtain holder", category: "Pen holders & curtain holders", description: handmade, availability: "Made to order", price: 399 }, 3),

  product({ id: "floral-door-toran", name: "Floral door toran", category: "Door torans & wall-door hangings", description: handmade, availability: "Made to order", price: 999 }, 2),
  product({ id: "leafy-wall-hanging", name: "Leafy wall hanging", category: "Door torans & wall-door hangings", description: handmade, availability: "In stock", price: 799 }, 1),

  product({ id: "floral-phone-case", name: "Floral phone case", category: "Decorated phone cases", description: handmade, availability: "Made to order", price: 599 }, 3),
  product({ id: "sunflower-phone-case", name: "Sunflower phone case", category: "Decorated phone cases", description: "A bright handmade case; share your phone model when ordering.", availability: "Made to order", price: 649 }, 0),
];

export const productCategories = [...new Set(products.map((product) => product.category))];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

// Unified luxury catalog — 7 distinct AI-generated images cycle across all products
// Products 1-7 each have a unique shirt type; 8+ cycle back with hover swap variation

const TOTAL_IMAGES = 40; // Total images (7 AI-generated + 33 original uploaded photos)

export const catalog = Array.from({ length: 40 }).map((_, i) => {
  const index = i + 1;
  
  // Cycle through all 40 product images (no repeats since catalog size is 40)
  const imageNum = 1 + (i % TOTAL_IMAGES);
  // Hover image is the next product image in the sequence
  const hoverImageNum = 1 + ((i + 1) % TOTAL_IMAGES);
  
  const imgUrl = `/products/product-${imageNum}.png`;
  const hoverImgUrl = `/products/product-${hoverImageNum}.png`;

  const fabrics = ["Mulberry Silk", "Italian Linen", "Egyptian Cotton", "Brushed Oxford", "Satin Jacquard", "Poplin Drape", "Premium Cotton"];
  const colors = ["Noir", "Blanc", "Slate", "Obsidian", "Oatmeal", "Ember", "Cobalt"];
  
  const categories = ["Checks", "Plain", "Printed", "Linen", "Overshirt"];
  const category = categories[i % categories.length];

  let fabric = fabrics[i % fabrics.length];
  if (category === "Linen") {
    fabric = "Italian Linen";
  }
  const color = colors[i % colors.length];
  const id = `shirt-${index}`;

  const categoryNamePart = category === "Checks" ? "Checked Shirt" :
                           category === "Plain" ? "Solid Shirt" :
                           category === "Printed" ? "Printed Shirt" :
                           category === "Linen" ? "Linen Shirt" : "Overshirt";

  // Label boxed packaging products professionally as premium gift sets
  let productName = `Atelier ${fabric} ${categoryNamePart} in ${color} (Vol. ${index})`;
  if (imageNum === 14) {
    productName = `Atelier Signature Packaging Gift Set — ${fabric} in ${color}`;
  } else if (imageNum === 15) {
    productName = `Atelier Monograph Luxe Gift Box — ${fabric} in ${color}`;
  }

  // Price range ₹999 – ₹2499
  const basePrice = 999 + (i % 10) * 150;

  return {
    id,
    name: productName,
    price: basePrice,
    originalPrice: i % 4 === 0 ? Math.round(basePrice * 1.3) : null,
    category,
    aesthetic: i % 4 === 0 ? "minimalist" : i % 4 === 1 ? "streetwear" : i % 4 === 2 ? "classic" : "avantgarde",
    image: imgUrl,
    imageHover: hoverImgUrl,
    rating: Number((4.3 + (i % 7) * 0.1).toFixed(1)),
    type: "shirt",
    tag: i % 7 === 0 ? "Best Seller" : i % 7 === 3 ? "Limited Drop" : "New Collection",
    sizes: {
      S: { chest: 92, waist: 84, shoulder: 42, length: 70 },
      M: { chest: 98, waist: 90, shoulder: 44, length: 72 },
      L: { chest: 104, waist: 96, shoulder: 46, length: 74 },
      XL: { chest: 110, waist: 102, shoulder: 48, length: 76 }
    },
    description: `Crafted from luxury ${fabric.toLowerCase()} fabric, this piece features a premium editorial drape in ${color.toLowerCase()}. Part of our exclusive Vol. ${index} release. Sizing vectors are calibrated to match standard posture frames.`
  };
});

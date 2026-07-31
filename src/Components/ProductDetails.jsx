import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import api from "../Api/api";

// 1. ADDED IMPORT FOR YOUR REAL STAR COMPONENT
import StarRating from "./StarRating"; 

const sizes = ["Small", "Medium", "Large", "X-Large"];
const colours = ["#4F4631", "#314F4A", "#31344F"];

const reviews = [
  {
    name: "Alex K.",
    date: "August 14, 2026",
    rating: 5,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
  },
  {
    name: "Sarah M.",
    date: "August 15, 2026",
    rating: 5,
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. Every piece I've bought has exceeded my expectations.",
  },
  {
    name: "James L.",
    date: "August 16, 2026",
    rating: 4,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is diverse and on-point.",
  },
  {
    name: "Emily R.",
    date: "August 17, 2026",
    rating: 5,
    text: "The ordering process was seamless, and the clothes arrived on time. The fit is perfect and everything feels thoughtfully made.",
  },
];

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColour, setSelectedColour] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [activeTab, setActiveTab] = useState("reviews");

  const { userId } = useAuth();

  const [quantity, setQuantity] = useState({});

  const handleQuantityChange = (productId, count) => {
    setQuantity(prev => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(1, currentQty + count);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const quantityToAdd = quantity[productId] || 1;
    let cartId = null;

    try {
      const cartResponse = await api.get("/api/Carts/cart");
      cartId = cartResponse.data.id;
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const newCartResponse = await api.post("/api/Carts", {
            userId: userId
          });
          cartId = newCartResponse.data.id;
        } catch (createError) {
          console.error("Failed to create a new cart:", createError);
          alert("Error creating your cart.");
          return;
        }
      } else {
        console.error("Error fetching cart:", error);
        return;
      }
    }

    try {
      await api.post(`/api/Carts/${cartId}/items`, {
        productId: productId,
        quantity: quantityToAdd
      });
      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item.");
    }
  };

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(
          `/api/Products/${productId}`
        );
        setProduct(response.data);
      } catch (requestError) {
        console.error(requestError);
        setError("Product could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
  }, [productId]);

  const originalPrice = useMemo(
    () => (product ? Math.ceil(product.price / 0.6) : 0),
    [product]
  );

  if (loading) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center font-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/15 border-t-black" />
        <p className="mt-4 text-black/60">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto min-h-[45vh] px-4 md:px-10 py-16 font-sans">
        <div className="rounded-2xl bg-red-50 p-5 text-red-700">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const imgSrc = product.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image';
  const images = [imgSrc, imgSrc, imgSrc];
  const rating = product.rating || 4.5;

  return (
    <main className="font-sans text-black">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <hr className="border-black/10" />

        <nav className="flex items-center gap-2 py-5 text-[14px] text-black/60">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>›</span>
          <span>Shop</span>
          <span>›</span>
          <span className="capitalize">{product.category || "Products"}</span>
          <span>›</span>
          <span className="text-black capitalize truncate w-32 md:w-auto">{product.name}</span>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[610px_1fr] lg:gap-10">
          <div className="grid gap-3 lg:grid-cols-[152px_1fr] lg:gap-3.5">
            <div className="order-2 grid grid-cols-3 gap-3 lg:order-1 lg:grid-cols-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`flex h-[106px] items-center justify-center rounded-[20px] bg-[#F0EEED] p-4 transition lg:h-[167px] ${selectedImage === index
                      ? "ring-2 ring-black"
                      : "hover:ring-1 hover:ring-black/30"
                    }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 flex h-[290px] items-center justify-center rounded-[20px] bg-[#F0EEED] p-8 lg:order-2 lg:h-[530px]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-integral text-[28px] leading-[1.05] font-bold uppercase md:text-[40px]">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              {/* 2. UPDATED PROP FROM value TO rating */}
              <StarRating rating={rating} />
              <span className="text-[14px]">{rating}<span className="text-black/60">/5</span></span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-[24px] font-bold md:text-[32px]">${product.price}</span>
              <span className="text-[24px] font-bold text-black/30 line-through md:text-[32px]">
                ${originalPrice}
              </span>
              <span className="rounded-full bg-[#FF3333]/10 px-3.5 py-1.5 text-[12px] font-medium text-[#FF3333] md:text-[16px]">
                -40%
              </span>
            </div>

            <p className="mt-3 text-[14px] leading-5 text-black/60 md:text-[16px] md:leading-[22px]">
              {product.description}
            </p>

            <hr className="my-5 border-black/10" />

            <fieldset>
              <legend className="mb-4 text-[14px] text-black/60 md:text-[16px]">Select Colors</legend>
              <div className="flex gap-3">
                {colours.map((colour, index) => (
                  <button
                    key={colour}
                    type="button"
                    onClick={() => setSelectedColour(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-full md:h-[37px] md:w-[37px]"
                    style={{ backgroundColor: colour }}
                    aria-label={`Select colour ${index + 1}`}
                  >
                    {selectedColour === index && <span className="text-xl text-white">✓</span>}
                  </button>
                ))}
              </div>
            </fieldset>

            <hr className="my-5 border-black/10" />

            <fieldset>
              <legend className="mb-4 text-[14px] text-black/60 md:text-[16px]">Choose Size</legend>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full px-5 py-2.5 text-[14px] transition md:px-6 md:py-3 ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#F0F0F0] text-black/60 hover:text-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <hr className="my-5 border-black/10" />

            <div className="flex gap-3">
              <div className="flex h-[52px] min-w-[110px] items-center justify-between rounded-full bg-[#F0F0F0] px-4 md:min-w-[170px] md:px-5">
                <button
                  type="button"
                  className="text-2xl cursor-pointer"
                  onClick={() => handleQuantityChange(product.id, -1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-[14px] font-medium md:text-[16px]">{quantity[product.id] || 1}</span>
                <button
                  type="button"
                  className="text-2xl cursor-pointer"
                  onClick={() => handleQuantityChange(product.id, 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleAddToCart(product.id)}
                className="h-[52px] flex-1 rounded-full bg-black px-6 text-[14px] font-medium cursor-pointer text-white transition hover:bg-black/80 md:text-[16px]"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>

        <section className="pt-14 md:pt-20">
          <div className="grid grid-cols-3 border-b border-black/10">
            {[
              ["details", "Product Details"],
              ["reviews", `Rating & Reviews`],
              ["faqs", "FAQs"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative pb-5 text-[14px] md:text-[20px] ${activeTab === tab ? "font-medium text-black" : "text-black/60"
                  }`}
              >
                {label}
                {activeTab === tab && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "reviews" && (
            <div className="py-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[20px] font-bold md:text-[24px]">
                  All Reviews <span className="text-[14px] font-normal text-black/60">(451)</span>
                </h2>
                <div className="flex gap-2">
                  <button type="button" className="h-10 w-10 rounded-full bg-[#F0F0F0]" aria-label="Filter reviews">☷</button>
                  <button type="button" className="hidden rounded-full bg-[#F0F0F0] px-5 text-[14px] md:block">Latest⌄</button>
                  <button type="button" className="rounded-full bg-black px-5 text-[12px] text-white md:px-6 md:text-[14px]">Write a Review</button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  <article key={review.name} className="rounded-[20px] border border-black/10 p-6 md:p-8">
                    <div className="flex justify-between">
                      {/* 3. UPDATED PROP FROM value TO rating */}
                      <StarRating rating={review.rating} compact />
                      <span className="text-xl text-black/40">•••</span>
                    </div>
                    <h3 className="mt-3 text-[20px] font-bold">
                      {review.name} <span className="text-[#01AB31]">✓</span>
                    </h3>
                    <p className="mt-3 text-[14px] leading-[22px] text-black/60 md:text-[16px]">
                      “{review.text}”
                    </p>
                    <p className="mt-5 text-[14px] font-medium text-black/60 md:text-[16px]">
                      Posted on {review.date}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button type="button" className="rounded-full border border-black/10 px-9 py-3.5 text-[14px] font-medium">
                  Load More Reviews
                </button>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="py-8 text-[16px] leading-7 text-black/60">
              <p>{product.description}</p>
              <p className="mt-4 capitalize"><strong className="text-black">Category:</strong> {product.category}</p>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="space-y-3 py-8">
              {["How does sizing work?", "What is your return policy?", "How should I care for this item?"].map((question) => (
                <details key={question} className="rounded-2xl border border-black/10 p-5">
                  <summary className="cursor-pointer font-medium">{question}</summary>
                  <p className="mt-3 text-black/60">Please contact our support team if you need more information about this product.</p>
                </details>
              ))}
            </div>
          )}
        </section>

        <section className="pb-16 pt-10 md:pb-20 md:pt-14">
          <h2 className="text-center font-integral text-[32px] font-bold uppercase md:text-[48px]">
            You might also like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-4 md:gap-5">
            {["Polo with Contrast Trims", "Gradient Graphic T-shirt", "Polo with Tipping Details", "Black Striped T-shirt"].map((name, index) => (
              <article key={name}>
                <div className="flex aspect-square items-center justify-center rounded-[20px] bg-[#F0EEED] p-8">
                  <img src={imgSrc} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
                <h3 className="mt-3 truncate text-[16px] font-bold md:text-[20px]">{name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  {/* 4. UPDATED PROP FROM value TO rating */}
                  <StarRating rating={index === 1 ? 3.5 : 4.5} compact />
                  <span className="text-[12px] text-black/60">4.5/5</span>
                </div>
                <p className="mt-1 text-[20px] font-bold md:text-[24px]">${120 + index * 25}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;

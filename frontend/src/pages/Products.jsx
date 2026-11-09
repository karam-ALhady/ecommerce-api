
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Products.css";

const STORAGE_URL = "http://127.0.0.1:8000/storage";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshProducts, setRefreshProducts] = useState(0);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products", {
                    params: {
                        page: currentPage,
                        ...(selectedCategory && {
                            category: selectedCategory,
                        }),
                    },
                });

                const result = response.data;

                setProducts(result.data || []);

                setPagination({
                    currentPage: result.current_page,
                    lastPage: result.last_page,
                    total: result.total,
                });

                const uniqueCategories = [
                    ...new Set(
                        (result.data || [])
                            .map((product) => product.category)
                            .filter(Boolean)
                    ),
                ];

                setCategories((previous) => [
                    ...new Set([...previous, ...uniqueCategories]),
                ]);
            } catch (err) {
                console.error("Failed to fetch products:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load products. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, refreshProducts]);

    const handleCreateOrder = async (product) => {
        const quantity = Number(
            prompt(`Enter quantity for ${product.name}:`, "1")
        );

        if (!Number.isInteger(quantity) || quantity < 1) {
            alert("Please enter a valid quantity.");
            return;
        }

        if (quantity > product.stock) {
            alert("Not enough stock available.");
            return;
        }

        try {
            const response = await api.post("/orders", {
                items: [
                    {
                        product_id: product.id,
                        quantity: quantity,
                    },
                ],
            });

            alert(
                `Order #${response.data.order.id} created successfully!`
            );

            // Refresh products to show the updated stock
            setRefreshProducts((value) => value + 1);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Unable to create order.";

            alert(message);
        }
    };

    const filteredProducts = products.filter((product) => {
        const searchText = search.toLowerCase();

        return (
            product.name.toLowerCase().includes(searchText) ||
            (product.description || "").toLowerCase().includes(searchText) ||
            (product.category || "").toLowerCase().includes(searchText)
        );
    });

    const getImageUrl = (image) => {
        if (!image) return null;

        return `${STORAGE_URL}/${image}`;
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="products-page">
            <section className="products-hero">
                <div className="products-hero-content">
                    <span className="hero-label">OUR COLLECTION</span>

                    <h1>Discover Our Products</h1>

                    <p>
                        Find the products you love at the best prices.
                        Explore our latest collection.
                    </p>
                </div>
            </section>

            <section className="products-container">
                <div className="products-heading">
                    <div>
                        <h2>All Products</h2>
                        <p>
                            Browse our available products and find
                            what you need.
                        </p>
                    </div>

                    <span className="products-count">
                        {pagination.total} Products
                    </span>
                </div>

                <div className="products-toolbar">
                    <div className="search-box">
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="category-select"
                    >
                        <option value="">All Categories</option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="products-message">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="products-message error-message">
                        <p>{error}</p>

                        <button onClick={() => setCurrentPage(1)}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="products-message">
                        <h3>No products found</h3>
                        <p>Try changing your search or category.</p>
                    </div>
                )}

                {!loading && !error && filteredProducts.length > 0 && (
                    <>
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <article
                                    className="product-card"
                                    key={product.id}
                                >
                                    <div className="product-image">
                                        {product.image ? (
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="no-image">
                                                No Image Available
                                            </div>
                                        )}

                                        <span className="product-category">
                                            {product.category}
                                        </span>
                                    </div>

                                    <div className="product-info">
                                        <h3>{product.name}</h3>

                                        <p className="product-description">
                                            {product.description ||
                                                "No description available."}
                                        </p>

                                        <div className="product-details">
                                            <span className="product-price">
                                                ${Number(product.price).toFixed(2)}
                                            </span>

                                            <span
                                                className={
                                                    product.stock > 0
                                                        ? "stock-available"
                                                        : "stock-unavailable"
                                                }
                                            >
                                                {product.stock > 0
                                                    ? `${product.stock} in stock`
                                                    : "Out of stock"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleCreateOrder(product)}
                                            disabled={product.stock <= 0}
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                marginTop: "15px",
                                                background: product.stock > 0 ? "#2563eb" : "#999",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: product.stock > 0 ? "pointer" : "not-allowed",
                                            }}
                                        >
                                            {product.stock > 0 ? "Place Order" : "Out of Stock"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="products-pagination">
                            <button
                                disabled={pagination.currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                            >
                                Previous
                            </button>

                            <span>
                                Page {pagination.currentPage} of{" "}
                                {pagination.lastPage}
                            </span>

                            <button
                                disabled={
                                    pagination.currentPage >=
                                    pagination.lastPage
                                }
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
                                }
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Products;

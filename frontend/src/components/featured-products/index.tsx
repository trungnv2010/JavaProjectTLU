// src/components/FeaturedProducts.jsx
import React, { useState, useEffect, useContext } from 'react';

import { getAllProducts } from 'src/services/product';
import { CartContext } from 'src/contexts/CartContext';
import { formatCurrency } from 'src/utils/format';
import {useRouter} from "next/router";

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const router = useRouter()

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setLoading(true);
            try {
                // Trong thực tế, có thể có API riêng cho sản phẩm nổi bật
                // Ở đây, chúng ta giả định lấy 6 sản phẩm đầu tiên
                const response = await getAllProducts({
                    page: 1,
                    limit: 6,
                    search: '',
                    sortBy: 'price',
                    direction: 'desc' // Sắp xếp theo giá cao đến thấp để lấy sản phẩm cao cấp
                });

                if (response && response.data) {
                    setFeaturedProducts(response.data.items || []);
                }
            } catch (err) {
                setError("Không thể tải sản phẩm nổi bật");
                console.error("Error fetching featured products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.discountPrice || product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    };

    const handleProductClick = (productId) => {
        router.push(`/product/${productId}`);
    };

    if (loading) {
        return <div className="section-loading">Đang tải sản phẩm nổi bật...</div>;
    }

    if (error) {
        return <div className="section-error">{error}</div>;
    }

    if (featuredProducts.length === 0) {
        return null; // Ẩn phần này nếu không có sản phẩm nổi bật
    }

    return (
        <div className="featured-products-section">
            <div className="section-header">
                <h2>Sản phẩm nổi bật</h2>
                <a href="/featured" className="view-all-link">Xem tất cả</a>
            </div>

            <div className="featured-products-grid">
                {featuredProducts.map(product => (
                    <div key={product.id} className="featured-product-card">
                        <div className="product-image" onClick={() => handleProductClick(product.id)}>
                            <img
                                src={product.imageUrl || '/images/placeholder.png'}
                                alt={product.name}
                                loading="lazy"
                            />
                            {product.discountPrice && product.discountPrice < product.price && (
                                <div className="discount-badge">
                                    -{Math.floor((1 - product.discountPrice / product.price) * 100)}%
                                </div>
                            )}
                        </div>

                        <div className="product-info" onClick={() => handleProductClick(product.id)}>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-brand">{product.brand}</p>

                            <div className="product-price">
                                {product.discountPrice && product.discountPrice < product.price ? (
                                    <>
                                        <span className="discounted-price">{formatCurrency(product.discountPrice)}</span>
                                        <span className="original-price">{formatCurrency(product.price)}</span>
                                    </>
                                ) : (
                                    <span className="price">{formatCurrency(product.price)}</span>
                                )}
                            </div>
                        </div>

                        <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stockQuantity <= 0}
                        >
                            {product.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
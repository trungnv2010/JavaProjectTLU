// ProductCard.jsx
import React from 'react';
import { formatCurrency } from 'src/utils/format'; // Utility để format tiền tệ

const ProductCard = ({ product, onAddToCart, onClick }) => {
    const { id, name, price, discountPrice, imageUrl, brand, stockQuantity } = product;

    const isDiscounted = discountPrice && discountPrice < price;
    const finalPrice = isDiscounted ? discountPrice : price;
    const discountPercentage = isDiscounted ? Math.floor((1 - discountPrice / price) * 100) : 0;

    return (
        <div className="product-card">
            <div className="product-image" onClick={onClick}>
                <img src={imageUrl || '/images/placeholder.png'} alt={name} />
                {isDiscounted && (
                    <div className="discount-badge">-{discountPercentage}%</div>
                )}
                {stockQuantity <= 0 && (
                    <div className="out-of-stock-overlay">Hết hàng</div>
                )}
            </div>

            <div className="product-info" onClick={onClick}>
                <h3 className="product-name">{name}</h3>
                <p className="product-brand">{brand}</p>

                <div className="product-price">
                    {isDiscounted ? (
                        <>
                            <span className="discounted-price">{formatCurrency(finalPrice)}</span>
                            <span className="original-price">{formatCurrency(price)}</span>
                        </>
                    ) : (
                        <span className="price">{formatCurrency(price)}</span>
                    )}
                </div>
            </div>

            <button
                className="add-to-cart-btn"
                onClick={onAddToCart}
                disabled={stockQuantity <= 0}
            >
                Thêm vào giỏ hàng
            </button>
        </div>
    );
};

export default ProductCard;
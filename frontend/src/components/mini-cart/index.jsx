// MiniCart.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from 'src/contexts/CartContext';
import { formatCurrency } from 'src/utils/format';

const MiniCart = () => {
    const { cart, cartTotal, removeFromCart, updateQuantity } = useContext(CartContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const handleUpdateQuantity = (productId, quantity) => {
        updateQuantity(productId, quantity);
    };

    return (
        <div className="mini-cart-container">
            <button className="cart-icon" onClick={toggleCart}>
                <i className="fas fa-shopping-cart"></i>
                {cart.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                )}
            </button>

            {isOpen && (
                <div className="mini-cart-dropdown">
                    <div className="mini-cart-header">
                        <h3>Giỏ hàng của bạn ({cart.length} sản phẩm)</h3>
                        <button className="close-btn" onClick={toggleCart}>×</button>
                    </div>

                    <div className="mini-cart-items">
                        {cart.length === 0 ? (
                            <div className="empty-cart-message">
                                Giỏ hàng của bạn đang trống
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.imageUrl || '/images/placeholder.png'} alt={item.name} />
                                    </div>

                                    <div className="item-details">
                                        <h4 className="item-name">{item.name}</h4>
                                        <div className="item-price">{formatCurrency(item.price)}</div>

                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="quantity-btn"
                                            >
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="quantity-btn"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className="remove-item-btn"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <>
                            <div className="mini-cart-subtotal">
                                <span>Tổng cộng:</span>
                                <span className="subtotal-amount">{formatCurrency(cartTotal)}</span>
                            </div>

                            <div className="mini-cart-actions">
                                <Link to="/cart" className="view-cart-btn" onClick={toggleCart}>
                                    Xem giỏ hàng
                                </Link>
                                <Link to="/checkout" className="checkout-btn" onClick={toggleCart}>
                                    Thanh toán
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MiniCart;
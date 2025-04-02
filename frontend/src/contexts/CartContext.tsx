// src/contexts/CartContext.tsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Kiểm tra nếu đang ở môi trường trình duyệt
    const [cart, setCart] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return []; // Giá trị mặc định nếu đang ở server
    });

    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Cập nhật localStorage khi giỏ hàng thay đổi
    useEffect(() => {
        // useEffect chỉ chạy ở phía client nên an toàn để sử dụng localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Tính toán số lượng và tổng giá trị
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setCartCount(itemCount);
        setCartTotal(total);
    }, [cart]);

    // Các hàm khác giữ nguyên...
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item.id === product.id);

            if (existingItemIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += product.quantity || 1;
                return updatedCart;
            } else {
                return [...prevCart, product];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
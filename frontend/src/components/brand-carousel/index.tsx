// src/components/BrandCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';

const BrandCarousel = ({ brands = [], onSelectBrand }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const carouselRef = useRef(null);

    // Đảm bảo brands là một mảng
    const brandsArray = Array.isArray(brands) ? brands : [];

    // Chuẩn bị dữ liệu thương hiệu với hình ảnh
    const brandData = brandsArray.map(brand => {
        // Kiểm tra nếu brand là string
        const brandName = typeof brand === 'string' ? brand :
            (brand && brand.name ? brand.name : 'unknown');

        // Sử dụng toLowerCase chỉ khi brandName là string
        const logoUrl = `/images/brands/${brandName.toLowerCase()}.png`;

        return {
            id: typeof brand === 'object' && brand !== null ? brand.id || brandName : brandName,
            name: brandName,
            logoUrl
        };
    });

    // Các phần còn lại giữ nguyên
    const updateArrowVisibility = () => {
        if (!carouselRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener('scroll', updateArrowVisibility);
            updateArrowVisibility();

            return () => {
                carouselElement.removeEventListener('scroll', updateArrowVisibility);
            };
        }
    }, []);

    useEffect(() => {
        updateArrowVisibility();
    }, [brands]);

    const scrollLeft = () => {
        if (!carouselRef.current) return;

        const newPosition = Math.max(0, scrollPosition - 300);
        carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
    };

    const scrollRight = () => {
        if (!carouselRef.current) return;

        const { scrollWidth, clientWidth } = carouselRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        const newPosition = Math.min(maxScrollLeft, scrollPosition + 300);
        carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
    };

    return (
        <div className="brand-carousel-container">
            {showLeftArrow && (
                <button
                    className="carousel-arrow left-arrow"
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                >
                    &#10094;
                </button>
            )}

            <div className="brand-carousel" ref={carouselRef}>
                {brandData.length > 0 ? (
                    brandData.map(brand => (
                        <div
                            key={brand.id}
                            className="brand-item"
                            onClick={() => onSelectBrand(brand.id)}
                        >
                            <div className="brand-logo">
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/brands/placeholder.png';
                                    }}
                                />
                            </div>
                            <div className="brand-name">{brand.name}</div>
                        </div>
                    ))
                ) : (
                    <div className="no-brands">Không có thương hiệu</div>
                )}
            </div>

            {showRightArrow && (
                <button
                    className="carousel-arrow right-arrow"
                    onClick={scrollRight}
                    aria-label="Scroll right"
                >
                    &#10095;
                </button>
            )}
        </div>
    );
};

export default BrandCarousel;
// src/components/Slider.jsx
import React, { useState, useEffect, useCallback } from 'react';

const Slider = ({ autoplay = true, interval = 5000 }) => {
    // Dữ liệu slider, trong thực tế có thể lấy từ API
    const slides = [
        {
            id: 1,
            imageUrl: '/images/slider/slider1.jpg',
            title: 'iPhone 14 Pro Max',
            subtitle: 'Công nghệ đỉnh cao, thiết kế sang trọng',
            link: '/products/iphone-14-pro-max',
            buttonText: 'Mua ngay'
        },
        {
            id: 2,
            imageUrl: '/images/slider/slider2.jpg',
            title: 'Samsung Galaxy S24 Ultra',
            subtitle: 'Camera chuyên nghiệp, hiệu năng vượt trội',
            link: '/products/samsung-galaxy-s24-ultra',
            buttonText: 'Khám phá'
        },
        {
            id: 3,
            imageUrl: '/images/slider/slider3.jpg',
            title: 'Xiaomi 13 Pro',
            subtitle: 'Hiệu năng mạnh mẽ, giá cả hợp lý',
            link: '/products/xiaomi-13-pro',
            buttonText: 'Xem chi tiết'
        },
        {
            id: 4,
            imageUrl: '/images/slider/slider4.jpg',
            title: 'SALE CUỐI THÁNG',
            subtitle: 'Giảm đến 30% cho tất cả sản phẩm',
            link: '/sales',
            buttonText: 'Mua sắm ngay'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Chuyển đến slide tiếp theo
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    // Chuyển đến slide trước đó
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Chuyển đến slide được chỉ định
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Tự động chuyển slide
    useEffect(() => {
        let slideInterval;

        if (autoplay && !isPaused) {
            slideInterval = setInterval(() => {
                nextSlide();
            }, interval);
        }

        return () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };
    }, [autoplay, isPaused, nextSlide, interval]);

    // Xử lý khi hover vào slider
    const handleMouseEnter = () => {
        if (autoplay) {
            setIsPaused(true);
        }
    };

    // Xử lý khi rời chuột khỏi slider
    const handleMouseLeave = () => {
        if (autoplay) {
            setIsPaused(false);
        }
    };

    return (
        <div
            className="slider-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${(index - currentSlide) * 100}%)`,
                            backgroundImage: `url(${slide.imageUrl || '/images/slider/placeholder.jpg'})`
                        }}
                    >
                        <div className="slide-content">
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-subtitle">{slide.subtitle}</p>
                            <a href={slide.link} className="slide-button">
                                {slide.buttonText}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <button className="slider-arrow prev-arrow" onClick={prevSlide}>
                &#10094;
            </button>
            <button className="slider-arrow next-arrow" onClick={nextSlide}>
                &#10095;
            </button>

            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
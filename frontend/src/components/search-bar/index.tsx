// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [searchText, setSearchText] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Các từ khóa gợi ý phổ biến (trong thực tế, có thể lấy từ API)
    const popularKeywords = [
        'iPhone', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo',
        'Điện thoại gaming', 'Smartphone giá rẻ', 'Điện thoại 5G',
        'Điện thoại chụp ảnh tốt', 'Điện thoại pin trâu'
    ];

    // Xử lý khi thay đổi text tìm kiếm
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        // Nếu có text, hiển thị gợi ý
        if (value.trim()) {
            // Lọc các từ khóa phù hợp với text đang nhập
            const filteredSuggestions = popularKeywords.filter(keyword =>
                keyword.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(filteredSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Xử lý khi focus vào ô tìm kiếm
    const handleFocus = () => {
        setIsFocused(true);
        // Chỉ hiển thị gợi ý khi có text và có suggestions
        if (searchText.trim() && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Xử lý khi blur khỏi ô tìm kiếm
    const handleBlur = () => {
        setIsFocused(false);
        // Delay ẩn suggestions để người dùng có thể click vào nó
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    // Xử lý khi submit form tìm kiếm
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            onSearch(searchText.trim());
            setShowSuggestions(false);
        }
    };

    // Xử lý khi click vào từ khóa gợi ý
    const handleSuggestionClick = (suggestion) => {
        setSearchText(suggestion);
        onSearch(suggestion);
        setShowSuggestions(false);

        // Focus lại vào ô input
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // Xử lý sự kiện click ra ngoài để đóng suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-container">
                    <input
                        ref={searchInputRef}
                        type="text"
                        className={`search-input ${isFocused ? 'focused' : ''}`}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchText}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />

                    <button type="submit" className="search-button">
                        <i className="fas fa-search"></i>
                    </button>

                    {/* Nút xóa text khi có text */}
                    {searchText && (
                        <button
                            type="button"
                            className="clear-button"
                            onClick={() => {
                                setSearchText('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                                searchInputRef.current?.focus();
                            }}
                        >
                            &times;
                        </button>
                    )}
                </div>

                {/* Danh sách gợi ý */}
                {showSuggestions && (
                    <div className="search-suggestions" ref={suggestionsRef}>
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <i className="fas fa-search suggestion-icon"></i>
                                <span>{suggestion}</span>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchBar;
// FilterSidebar.jsx
import React, { useState, useEffect } from 'react';
import { formatCurrency } from 'src/utils/format';

const FilterSidebar = ({ brands, categories, priceRange, onFilterChange }) => {
    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        priceRange: { min: 0, max: 50000000 } // Giá trị mặc định (VND)
    });

    // Cập nhật filters khi props thay đổi
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            priceRange: priceRange || prev.priceRange
        }));
    }, [priceRange]);

    const handleBrandChange = (e) => {
        const brandValue = e.target.value;
        setFilters(prev => ({ ...prev, brand: brandValue }));
    };

    const handleCategoryChange = (e) => {
        const categoryValue = e.target.value;
        setFilters(prev => ({ ...prev, category: categoryValue }));
    };

    const handlePriceChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: parseInt(value) || 0
            }
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleResetFilters = () => {
        const resetFilters = {
            brand: '',
            category: '',
            priceRange: { min: 0, max: 50000000 }
        };

        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="filter-sidebar">
            <h3>Bộ lọc sản phẩm</h3>

            <div className="filter-section">
                <h4>Thương hiệu</h4>
                <select
                    value={filters.brand}
                    onChange={handleBrandChange}
                >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Danh mục</h4>
                <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="filter-section">
                <h4>Khoảng giá</h4>
                <div className="price-range-inputs">
                    <div className="price-input">
                        <label>Từ:</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                        />
                    </div>
                    <div className="price-input">
                        <label>Đến:</label>
                        <input
                            type="number"
                            min="0"
                            value={filters.priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                        />
                    </div>
                </div>
                <div className="price-range-labels">
                    <span>{formatCurrency(filters.priceRange.min)}</span>
                    <span>{formatCurrency(filters.priceRange.max)}</span>
                </div>
            </div>

            <div className="filter-actions">
                <button className="apply-filter-btn" onClick={handleApplyFilters}>
                    Áp dụng
                </button>
                <button className="reset-filter-btn" onClick={handleResetFilters}>
                    Đặt lại
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
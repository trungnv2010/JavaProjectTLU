// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Không hiển thị phân trang nếu chỉ có 1 trang
    if (totalPages <= 1) {
        return null;
    }

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Nếu có ít hơn hoặc bằng 7 trang, hiển thị tất cả
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu tiên
            pageNumbers.push(1);

            // Hiển thị ... nếu trang hiện tại lớn hơn 3
            if (currentPage > 3) {
                pageNumbers.push('...');
            }

            // Hiển thị trang hiện tại và các trang xung quanh
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Hiển thị ... nếu trang hiện tại nhỏ hơn tổng số trang - 2
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }

            // Luôn hiển thị trang cuối cùng
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination">
            {/* Nút quay lại trang trước */}
            <button
                className="pagination-button prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                &laquo;
            </button>

            {/* Các nút số trang */}
            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              &hellip;
            </span>
                    );
                }

                return (
                    <button
                        key={page}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                        disabled={currentPage === page}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Nút đến trang tiếp theo */}
            <button
                className="pagination-button next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Using heroicons for nice arrows

const PaginationControls = ({ currentPage, totalCount, onPageChange, pageSize = 10 }) => {
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Don't render the controls if there's only one page or no data
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        // Go to the previous page, but not below 1
        onPageChange(Math.max(currentPage - 1, 1));
    };

    const handleNext = () => {
        // Go to the next page, but not beyond the total number of pages
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    // Calculate which items are being shown, e.g., "Showing 11-20 of 100"
    const firstItem = (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="flex items-center justify-between mt-4">
            {/* Left side: "Showing X-Y of Z" */}
            <p className="text-sm text-base-content/70">
                Showing <span className="font-medium">{firstItem}</span> to <span className="font-medium">{lastItem}</span> of <span className="font-medium">{totalCount}</span> results
            </p>

            {/* Right side: Buttons */}
            <div className="join">
                <button
                    className="join-item btn"
                    onClick={handlePrevious}
                    disabled={currentPage === 1} // Disable if on the first page
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                    Previous
                </button>
                <button
                    className="join-item btn"
                >
                    Page {currentPage} of {totalPages}
                </button>
                <button
                    className="join-item btn"
                    onClick={handleNext}
                    disabled={currentPage === totalPages} // Disable if on the last page
                >
                    Next
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
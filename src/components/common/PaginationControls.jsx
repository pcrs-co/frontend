// src/components/common/PaginationControls.jsx
import React from 'react';

const PaginationControls = ({ responseData, onPageChange }) => {
    // Don't render anything if there's only one page or no data
    if (!responseData?.count || responseData.count <= 10) { // Assumes default page size of 10
        return null;
    }

    const currentPage = new URLSearchParams(window.location.search).get('page') || 1;
    const totalPages = Math.ceil(responseData.count / 10); // Calculate total pages

    const handleNext = () => {
        const nextUrl = responseData.next;
        if (nextUrl) {
            const pageNumber = new URL(nextUrl).searchParams.get('page');
            onPageChange(Number(pageNumber));
        }
    };

    const handlePrev = () => {
        const prevUrl = responseData.previous;
        if (prevUrl) {
            const pageNumber = new URL(prevUrl).searchParams.get('page');
            onPageChange(Number(pageNumber));
        } else {
            // Handle case where previous is null but we are not on page 1
            onPageChange(1);
        }
    };

    return (
        <div className="flex justify-center items-center space-x-2 py-4">
            <div className="join">
                <button
                    onClick={handlePrev}
                    disabled={!responseData.previous}
                    className="join-item btn"
                >
                    «
                </button>
                <button className="join-item btn">
                    Page {currentPage} of {totalPages}
                </button>
                <button
                    onClick={handleNext}
                    disabled={!responseData.next}
                    className="join-item btn"
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
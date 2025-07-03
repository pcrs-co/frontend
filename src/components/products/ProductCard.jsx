// src/components/products/ProductCard.jsx

import React from 'react';

// A small, reusable component for displaying specs with icons.
const SpecIcon = ({ icon, text, title }) => {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-base-content/70" title={`${title}: ${text}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icon}
      </svg>
      <span className="truncate">{text}</span>
    </div>
  );
};

export default function ProductCard({ product, onViewDetails }) {
  const imageUrl = product.images?.[0]?.image || `https://dummyimage.com/400x300/f0f0f0/aaa.png&text=No+Image`;

  const formattedPrice = product.price > 0
    ? `TSh ${new Intl.NumberFormat('en-US').format(product.price)}`
    : 'Price on request';

  const processorSpec = product.processor?.data_received.split(',')[0] || 'N/A';
  const graphicSpec = product.graphic?.data_received.split(',')[0] || 'N/A';
  const memorySpec = product.memory?.data_received || 'N/A';

  const getTagClass = (type) => {
    switch (type) {
      case 'success': return 'badge-success';
      case 'info': return 'badge-info';
      case 'warning': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 group">
      {/* --- TAGS SECTION --- */}
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
        {product.match_details?.tags?.map(tag => (
          <div key={tag.text} className={`badge badge-sm text-white ${getTagClass(tag.type)}`}>
            {tag.text}
          </div>
        ))}
      </div>

      <figure className="h-48 bg-base-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </figure>

      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <h2 className="card-title text-base font-bold truncate" title={product.name}>
            {product.name}
          </h2>
          <p className="text-sm text-base-content/60 -mt-1">{product.brand}</p>
        </div>

        <div className="my-2 space-y-1">
          <SpecIcon
            title="CPU"
            text={processorSpec}
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 12a4 4 0 118 0 4 4 0 01-8 0z" />}
          />
          <SpecIcon
            title="GPU"
            text={graphicSpec}
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
          />
          <SpecIcon
            title="RAM"
            text={memorySpec}
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />}
          />
        </div>

        <div className="card-actions justify-between items-center mt-2">
          <p className="text-lg font-extrabold text-primary">{formattedPrice}</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
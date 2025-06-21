// src/components/products/ProductCard.jsx
import React from 'react';

const ProductCard = ({ laptop }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <figure className="px-6 pt-6 h-48 flex items-center justify-center bg-white rounded-t-xl">
        <img src={laptop.imageUrl} alt={laptop.name} className="rounded-xl object-contain h-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {laptop.name}
          <div className="badge badge-accent">{laptop.brand}</div>
        </h2>
        <div className="flex justify-between items-center mt-4">
            <p className="font-mono text-xl text-primary">${laptop.price}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">View Details</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

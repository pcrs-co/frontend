// src/components/admin/dashboard/StatCard.jsx
import { Link } from 'react-router-dom';

const StatCard = ({ icon, title, value, description, linkTo, isLoading, colorClass = 'bg-base-100' }) => {
    
    // DaisyUI skeleton for a beautiful loading state
    if (isLoading) {
        return (
            <div className="stat shadow-lg rounded-lg bg-base-100">
                <div className="stat-figure text-secondary">
                    <div className="w-12 h-12 skeleton rounded-full"></div>
                </div>
                <div className="stat-title h-4 w-24 skeleton mb-2"></div>
                <div className="stat-value h-8 w-16 skeleton"></div>
                <div className="stat-desc h-4 w-32 skeleton mt-2"></div>
            </div>
        )
    }

    const CardContent = () => (
        <div className={`stat shadow-lg rounded-lg ${colorClass}`}>
            <div className="stat-figure text-primary">
                {icon}
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc">{description}</div>
        </div>
    );
    
    // Make the entire card a link if linkTo is provided
    return linkTo ? <Link to={linkTo} className="hover:opacity-80 transition-opacity">{CardContent()}</Link> : CardContent();
};

export default StatCard;
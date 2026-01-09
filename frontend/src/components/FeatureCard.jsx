import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({
    icon,
    title,
    description,
    linkTo,
    buttonText = "Explore",
    onClick
}) => {
    const CardContent = () => (
        <>
            <div className="text-2xl font-black text-primary-400 mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
            <p className="text-sm text-text-muted mb-4">{description}</p>
            <button className="btn btn-outline text-sm py-2 px-4">
                {buttonText}
            </button>
        </>
    );

    if (linkTo) {
        return (
            <Link
                to={linkTo}
                className="card flex flex-col items-center text-center p-6 group no-underline"
            >
                <CardContent />
            </Link>
        );
    }

    return (
        <div
            onClick={onClick}
            className="card flex flex-col items-center text-center p-6 group cursor-pointer"
        >
            <CardContent />
        </div>
    );
};

export default FeatureCard;

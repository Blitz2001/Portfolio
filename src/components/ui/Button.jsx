import React from 'react';

const Button = ({ children, onClick, href, variant = 'primary', className = '' }) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2 text-sm font-medium transition-transform duration-200 ease-out active:scale-95 border rounded-md";

    const variants = {
        primary: "bg-gray-900 text-white border-transparent hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
        white: "bg-white text-gray-900 border-transparent hover:bg-gray-100 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
        outline: "bg-transparent text-gray-900 border-gray-300 hover:border-gray-900 dark:text-white dark:border-gray-700 dark:hover:border-white",
        ghost: "bg-transparent text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10",
    };

    const Component = href ? 'a' : 'button';

    // Determine props based on whether it's an external link or internal anchor
    const isExternal = href && href.startsWith('http');
    const linkProps = isExternal
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : { href };

    const props = href ? linkProps : { onClick };

    return (
        <Component
            {...props}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </Component>
    );
};

export default Button;

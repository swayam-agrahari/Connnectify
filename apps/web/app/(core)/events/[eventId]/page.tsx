// components/UnderDevelopment.tsx

import React from "react";

const UnderDevelopment: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">

            {/* Spinner */}
            <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

            {/* Message box */}
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg shadow-md max-w-md">
                <h1 className="text-2xl font-semibold mb-2">🚧 Page Under Development</h1>
                <p className="text-sm text-yellow-700">
                    We’re working hard to bring this page to life. Please check back soon!
                </p>
            </div>
        </div>
    );
};

export default UnderDevelopment;

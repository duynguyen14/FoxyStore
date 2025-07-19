import React from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
    // const isLoading = useSelector(state => state.loading);

    // if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        </div>
    );
};

export default Loading;

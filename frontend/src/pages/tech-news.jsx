import React from 'react';
import RedditFeed from '../components/RedditFeed';

const TechNewsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Tech News & Updates</h1>
                <RedditFeed />
            </div>
        </div>
    );
};

export default TechNewsPage; 
import React, { useState, useEffect } from 'react';
import { FaReddit, FaArrowUp, FaComment, FaExternalLinkAlt } from 'react-icons/fa';

const RedditFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubreddit, setSelectedSubreddit] = useState('technology');

    const subreddits = [
        { id: 'technology', name: 'Technology' },
        { id: 'programming', name: 'Programming' },
        { id: 'webdev', name: 'Web Development' },
        { id: 'coding', name: 'Coding' },
        { id: 'technews', name: 'Tech News' }
    ];

    useEffect(() => {
        fetchPosts();
    }, [selectedSubreddit]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log(`Fetching posts from r/${selectedSubreddit}`);
            
            const response = await fetch(`http://localhost:5000/api/reddit/${selectedSubreddit}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Received ${data.length} posts from r/${selectedSubreddit}`);
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
                <p className="font-medium mb-2">Error Loading Posts</p>
                <p className="text-sm mb-4">{error}</p>
                <button 
                    onClick={fetchPosts}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-6">
                <FaReddit className="text-2xl text-orange-500" />
                <h2 className="text-2xl font-bold">Tech Feed</h2>
            </div>

            {/* Subreddit Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {subreddits.map((subreddit) => (
                    <button
                        key={subreddit.id}
                        onClick={() => setSelectedSubreddit(subreddit.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${
                            selectedSubreddit === subreddit.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        r/{subreddit.id}
                    </button>
                ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div 
                        key={post.id}
                        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                <FaArrowUp className="text-gray-400" />
                                <span className="text-sm font-medium">{post.ups}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span>Posted by u/{post.author}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.created_utc)}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {post.title}
                                </h3>
                                {post.selftext && (
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.selftext}
                                    </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <a 
                                        href={`https://reddit.com${post.permalink}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-blue-500"
                                    >
                                        <FaComment />
                                        <span>{post.num_comments} comments</span>
                                    </a>
                                    {post.url && !post.url.includes('reddit.com') && (
                                        <a 
                                            href={post.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-blue-500"
                                        >
                                            <FaExternalLinkAlt />
                                            <span>View Link</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RedditFeed; 
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Reddit API configuration
const REDDIT_API_URL = 'https://www.reddit.com/r';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Middleware to handle caching
const cacheMiddleware = (req, res, next) => {
    const subreddit = req.params.subreddit;
    const cachedData = cache.get(subreddit);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log(`Serving cached data for r/${subreddit}`);
        return res.json(cachedData.data);
    }
    
    next();
};

// Get posts from a subreddit
router.get('/:subreddit', cacheMiddleware, async (req, res) => {
    try {
        const { subreddit } = req.params;
        console.log(`Fetching posts from r/${subreddit}`);

        const response = await axios.get(`${REDDIT_API_URL}/${subreddit}/hot.json`, {
            params: {
                limit: 25,
                raw_json: 1
            },
            headers: {
                'User-Agent': 'T-HUB Tech News Aggregator/1.0 (by /u/YourRedditUsername)'
            }
        });

        if (!response.data || !response.data.data || !response.data.data.children) {
            throw new Error('Invalid response format from Reddit API');
        }

        const posts = response.data.data.children.map(post => ({
            id: post.data.id,
            title: post.data.title,
            author: post.data.author,
            created_utc: post.data.created_utc,
            ups: post.data.ups,
            num_comments: post.data.num_comments,
            permalink: post.data.permalink,
            url: post.data.url,
            selftext: post.data.selftext,
            thumbnail: post.data.thumbnail,
            is_video: post.data.is_video,
            domain: post.data.domain
        }));

        console.log(`Successfully fetched ${posts.length} posts from r/${subreddit}`);

        // Cache the results
        cache.set(subreddit, {
            data: posts,
            timestamp: Date.now()
        });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching Reddit posts:', error.message);
        if (error.response) {
            console.error('Reddit API response:', error.response.data);
            console.error('Status:', error.response.status);
        }
        res.status(500).json({ 
            error: 'Failed to fetch Reddit posts',
            details: error.message,
            status: error.response?.status
        });
    }
});

module.exports = router; 
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ExternalLink, Calendar, Tag, Loader2 } from 'lucide-react';

const FOSSNewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  
  const API = [
    'https://dev.to/api/articles',
    'https://dev.to/api/articles?tag=opensource',
    'https://www.reddit.com/r/opensource/.json',
    'https://hacker-news.firebaseio.com/v0/topstories.json',
  ];

  
  const generateMockArticles = (pageNum) => {
    const topics = ['Linux', 'Open Source', 'FOSS', 'Programming', 'DevOps', 'Security', 'Cloud', 'AI/ML'];
    const sources = ['FOSS News', 'Open Source Today', 'Linux Journal', 'Tech Republic', 'Developer Weekly'];
    
    return API.from({ length: 10 }, (_, i) => ({
      id: `article-${pageNum}-${i}`,
      title: `${topics[Math.floor(Math.random() * topics.length)]} ${
        ['Update', 'News', 'Release', 'Tutorial', 'Guide', 'Review'][Math.floor(Math.random() * 6)]
      } ${pageNum * 10 + i + 1}`,
      description: 'll',
      link: `https://example.com/article-${pageNum}-${i}`,
      pubDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      category: topics[Math.floor(Math.random() * topics.length)],
      readTime: Math.floor(Math.random() * 10) + 2
    }));
  };

  // Simulate fetching articles with delay
  const fetchArticles = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const newArticles = generateMockArticles(pageNum);
      
      if (pageNum === 1) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }
      
      // Simulate end of content after 5 pages
      if (pageNum >= 5) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Load more articles when page changes
  useEffect(() => {
    fetchArticles(page);
  }, [page, fetchArticles]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Initial load
  useEffect(() => {
    fetchArticles(1);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Linux': 'bg-blue-100 text-blue-800',
      'Open Source': 'bg-green-100 text-green-800',
      'FOSS': 'bg-purple-100 text-purple-800',
      'Programming': 'bg-yellow-100 text-yellow-800',
      'DevOps': 'bg-red-100 text-red-800',
      'Security': 'bg-orange-100 text-orange-800',
      'Cloud': 'bg-indigo-100 text-indigo-800',
      'AI/ML': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              FOSS News Hub
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {articles.length} articles loaded
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.readTime} min read
                  </span>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(article.pubDate)}</span>
                  </div>
                  <span className="font-medium">{article.source}</span>
                </div>
                
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  <span>Read More</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading more articles...</span>
          </div>
        )}

        {/* End of Content */}
        {!hasMore && articles.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-sm">You've reached the end</span>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        {hasMore && articles.length > 0 && !loading && (
          <div className="text-center py-4">
            <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Scroll for more articles</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FOSSNewsApp;
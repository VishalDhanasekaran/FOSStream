import { useState, useEffect, useCallback } from 'react';
import useAggregatedArticles from "./FOSSAPI";

export default function ArticlesList() {
  const [page, setPage] = useState(1);
  const [allArticles, setAllArticles] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { articles, loading, error } = useAggregatedArticles(page);

  // Add new articles to the existing list
  useEffect(() => {
    if (articles && articles.length > 0) {
      setAllArticles(prev => {
        if (page === 1) {
          return articles;
        }
        return [...prev, ...articles];
      });
      setIsLoadingMore(false);
    }
  }, [articles, page]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      !loading &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, isLoadingMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-400/10 border-b-yellow-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          <div className="mt-4 text-yellow-400 text-center font-mono">Loading articles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 backdrop-blur-sm">
          <div className="text-red-400 text-center font-mono text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-32 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-yellow-400/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-16 sticky top-0 bg-black/80 backdrop-blur-xl border-b border-yellow-400/20">
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4 tracking-tight">
          FOSStream
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4"></div>
        <p className="text-yellow-400/70 text-lg font-mono tracking-wide">
          Latest FOSS & Science News
        </p>
      </div>

      {/* Articles Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {allArticles.map((a, index) => (
            <div
              key={a.id}
              className="group relative opacity-0 animate-fade-in"
              style={{
                animationDelay: `${(index % 9) * 0.1}s`,
                animationFillMode: 'forwards'
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/80 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-8 hover:border-yellow-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-xl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400/50 rounded-br-xl"></div>
                
                {/* Article content */}
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group-hover:text-yellow-300 transition-colors duration-300"
                >
                  <h2 className="text-xl font-bold text-yellow-400 mb-4 leading-tight group-hover:text-yellow-300 transition-colors duration-300">
                    {a.title}
                  </h2>
                </a>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {a.description || 'No description available.'}
                </p>
                
                {/* Source info */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-400/80 font-mono font-semibold px-2 py-1 bg-yellow-400/10 rounded-full">
                    {a.source}
                  </span>
                  <span className="text-gray-400 font-mono">
                    {new Date(a.pubDate).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-3 border-yellow-400/10 border-b-yellow-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>

    </div>
  );
}
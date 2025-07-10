import useAggregatedArticles from "./FOSSAPI";

export default function ArticlesList() {
  const { articles, loading, error } = useAggregatedArticles(1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-black">
      <h1 className="text-yellow-400 font-extrabold">FOSStream</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 px-4 bg-black">
        {articles.map((a) => (
          <div
            key={a.id}
            className="bg-black backdrop-blur-lg border border-yellow-400/30 shadow-md rounded-lg p-6 hover:shadow-yellow-400/30 transition-all duration-300"
          >
            <a
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-2">{a.title}</h2>
            </a>
            <p className="text-dimWhite text-sm mb-4">{a.description || 'No description available.'}</p>
            <small className="text-gray-400 font-mono">
              {a.source} • {new Date(a.pubDate).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}



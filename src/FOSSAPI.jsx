import React, { useState, useEffect } from "react";
const fetchDevTo = async (page = 1) => {
  const res = await fetch(`https://dev.to/api/articles?tag=opensource&page=${page}`);
  const arr = await res.json();
  return arr.map((a) => ({
    id: `devto-${a.id}`,
    title: a.title,
    description: a.description || a.readable_publish_date,
    link: a.url,
    pubDate: a.published_at,
    source: "Dev.to",
    category: a.tag_list[0] || "Dev.to",
    readTime: a.readable_publish_date,
  }));
};
const fetchHN = async () => {
  const topIdsRes = await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json`);
  const ids = await topIdsRes.json();
  const slice = ids.slice(0, 10);
  const items = await Promise.all(
    slice.map(async (id) => {
      const resp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return resp.json();
    })
  );
  return items.map((i) => ({
    id: `hn-${i.id}`,
    title: i.title,
    description: "",
    link: i.url || `https://news.ycombinator.com/item?id=${i.id}`,
    pubDate: new Date(i.time * 1000).toISOString(),
    source: "Hacker News",
    category: "HN",
    readTime: 3,
  }));
};


export default function useAggregatedArticles(page = 1) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [devto, hn] = await Promise.all([
          fetchDevTo(page),
          
          fetchHN(),

        ]);
        setArticles([...devto, ...hn,]);
      } catch (e) {
        console.log(e)
        setError("Error loading articles");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return { articles, loading, error };
}




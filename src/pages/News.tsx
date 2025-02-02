import React, { useState, useEffect } from 'react';
import { Newspaper, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  categories: string[];
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'all',
    'bitcoin',
    'ethereum',
    'defi',
    'nft',
    'regulation'
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN'
        );
        const data = await response.json();
        setNews(data.Data.map((item: any) => ({
          title: item.title,
          url: item.url,
          source: item.source,
          publishedAt: new Date(item.published_on * 1000).toLocaleString(),
          categories: item.categories.toLowerCase().split('|')
        })));
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.categories.includes(selectedCategory);
    const matchesSearch = item.title.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050510] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-[#00f3ff] hover:text-[#00f3ff]/80 flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl text-[#00f3ff] font-bold flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              Crypto News
            </h1>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-4 py-2 pl-10 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md capitalize ${
                    selectedCategory === category
                      ? 'bg-[#00f3ff] text-[#0a0a1f]'
                      : 'border border-[#00f3ff] text-[#00f3ff]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-[#00f3ff]/20 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-[#00f3ff]/10 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-[#00f3ff]/10 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-[#00f3ff]/20 rounded-lg p-6 hover:bg-[#0a0a1f]/50 transition-colors"
                >
                  <h2 className="text-[#00f3ff] text-lg font-medium mb-2">{item.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>{item.source}</span>
                    <span>{item.publishedAt}</span>
                    <div className="flex gap-2">
                      {item.categories.slice(0, 3).map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#00f3ff]/10 rounded-full text-xs"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
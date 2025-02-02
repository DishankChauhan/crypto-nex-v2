import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using CryptoCompare News API
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=ETH'
        );
        const data = await response.json();
        setNews(data.Data.slice(0, 5).map((item: any) => ({
          title: item.title,
          url: item.url,
          source: item.source,
          publishedAt: new Date(item.published_on * 1000).toLocaleString()
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

  if (loading) {
    return (
      <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#00f3ff]/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4 flex items-center gap-2">
        <Newspaper className="h-5 w-5" />
        Crypto News
      </h3>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-[#00f3ff]/20 rounded-lg p-4 hover:bg-[#0a0a1f]/50 transition-colors"
          >
            <h4 className="text-[#00f3ff] font-medium mb-2">{item.title}</h4>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{item.source}</span>
              <span>{item.publishedAt}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
export function Nav() {
  const [path, setPath] = useState('');
  useEffect(() => { setPath(location.pathname); }, []);
  const cur = (p) => (path.startsWith(p) ? 'page' : undefined);
  return (
    <nav>
      <a href="/news" aria-current={cur('/news') || cur('/daily')}>뉴스</a>
      <a href="/posts" aria-current={cur('/posts')}>기록</a>
    </nav>
  );
}

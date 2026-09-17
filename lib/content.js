import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.join(process.cwd(), 'content');

function read(kind) {
  const dir = path.join(ROOT, kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
      return { slug: f.replace(/\.md$/, ''), kind, ...data, body: content };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const daily = () => read('daily');
export const posts = () => read('posts');
export const all = () => [...daily(), ...posts()].sort((a, b) => (a.date < b.date ? 1 : -1));
export const one = (kind, slug) => read(kind).find((x) => x.slug === slug);
export const html = (md) => marked.parse(md);

export function longDate(d) {
  const [y, m, day] = String(d).split('-').map(Number);
  const w = ['일', '월', '화', '수', '목', '금', '토'][new Date(Date.UTC(y, m - 1, day)).getUTCDay()];
  return `${y}년 ${m}월 ${day}일 ${w}요일`;
}
export const shortDate = (d) => String(d).replace(/-/g, '.');
export const KIND = { daily: '뉴스', posts: '기록' };

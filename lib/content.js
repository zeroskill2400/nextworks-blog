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
const inline = (s) => marked.parseInline(s.trim());

/*
  다이제스트 본문 규칙 (사람이 쓰고 스크립트도 쓰는 형식)

  ## 섹션 제목
  ### 꼭지 제목
  출처: 이름 | https://주소   (여러 줄 가능. 첫 줄이 제목 링크가 된다)
  이끄는 문단 (한두 문단)
  - 불릿
  **무엇이 달라지나.** 판단 문장
  **한계.** 판단 문장
  #### 자세히          (선택. 이 아래 문단은 기사 페이지에만 나온다)

  "지원사업"이 들어간 섹션은 표로 그린다:
  - 사업명 | 주관 | 기간 | https://공고주소
*/
export function parseDaily(md) {
  const chunks = md.split(/^## /m).map((c) => c.trim()).filter(Boolean);
  const sections = [];
  let programs = null;
  let n = 0;
  chunks.forEach((chunk, si) => {
    const [head, ...rest] = chunk.split('\n');
    const title = head.trim();
    const body = rest.join('\n');
    if (/지원사업/.test(title)) {
      const rows = [];
      let note = '';
      body.split('\n').forEach((l) => {
        const t = l.trim();
        if (!t) return;
        if (t.startsWith('- ')) {
          const [name, org, period, url] = t.slice(2).split('|').map((x) => x.trim());
          rows.push({ name, org, period, url });
        } else note += (note ? ' ' : '') + t;
      });
      programs = { title, note, rows };
      return;
    }
    const parts = body.split(/^### /m);
    const items = parts.slice(1).map((p, ii) => {
      const [h, ...ls] = p.split('\n');
      n += 1;
      const item = { id: `s${si}-${ii}`, n, section: title, title: h.trim(), links: [], lead: [], bullets: [], judge: [], detail: [] };
      let para = [];
      let mode = 'lead';
      const flush = () => { if (para.length) { (mode === 'detail' ? item.detail : item.lead).push(inline(para.join(' '))); para = []; } };
      ls.forEach((raw) => {
        const l = raw.trim();
        if (!l) { flush(); return; }
        let m;
        if (/^#### 자세히/.test(l)) { flush(); mode = 'detail'; return; }
        if ((m = l.match(/^출처:\s*(.+?)\s*\|\s*(\S+)$/))) { item.links.push({ name: m[1], url: m[2] }); return; }
        if ((m = l.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/))) { flush(); item.judge.push({ k: m[1], v: inline(m[2]) }); return; }
        if (l.startsWith('- ')) { flush(); item.bullets.push(inline(l.slice(2))); return; }
        para.push(l);
      });
      flush();
      return item;
    });
    sections.push({ title, items });
  });
  const items = sections.flatMap((x) => x.items);
  return { sections, programs, items };
}

export function longDate(d) {
  const [y, m, day] = String(d).split('-').map(Number);
  const w = ['일', '월', '화', '수', '목', '금', '토'][new Date(Date.UTC(y, m - 1, day)).getUTCDay()];
  return `${y}년 ${m}월 ${day}일 ${w}요일`;
}
export const shortDate = (d) => String(d).replace(/-/g, '.');
export const KIND = { daily: '뉴스', posts: '기록' };

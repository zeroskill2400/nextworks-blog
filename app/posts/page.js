import { all, daily, parseDaily } from '../../lib/content';
import { Bar, Foot, Side } from '../_parts/Chrome';
import { Search } from '../_parts/Tools';

export const metadata = { title: '기록' };

export default function Page() {
  const order = daily().map((x) => x.slug).sort();
  const docs = all().filter((x) => x.kind === 'posts').map((x) => ({
    kind: x.kind, slug: x.slug, title: x.title, summary: x.summary, date: String(x.date),
    cover: x.kind === 'daily' ? `/og/${x.slug}.png` : (x.cover || null),
    n: x.kind === 'daily' ? order.indexOf(x.slug) + 1 : null,
    items: x.kind === 'daily' && /^### /m.test(x.body) ? parseDaily(x.body).items.map((i) => i.title).join(' ') : '',
  }));
  return (
    <>
      <Bar />
      <section className="band"><div className="wrap"><h1>기록</h1><p>직접 만들며 남긴 것. 무엇이 문제였고 어떻게 풀었는지 적습니다.</p></div></section>
      <div className="wrap two">
        <main><Search docs={docs} kind="posts" /></main>
        <Side />
      </div>
      <Foot />
    </>
  );
}

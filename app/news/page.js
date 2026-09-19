import { all, daily, parseDaily } from '../../lib/content';
import { Bar, Foot, Side } from '../_parts/Chrome';
import { Search } from '../_parts/Tools';

export const metadata = { title: '뉴스' };

export default function Page() {
  const order = daily().map((x) => x.slug).sort();
  const docs = all().filter((x) => x.kind === 'daily').map((x) => ({
    kind: x.kind, slug: x.slug, title: x.title, summary: x.summary, date: String(x.date),
    cover: x.kind === 'daily' ? `/og/${x.slug}-thumb.png` : (x.cover || null),
    n: x.kind === 'daily' ? order.indexOf(x.slug) + 1 : null,
    items: x.kind === 'daily' && /^### /m.test(x.body) ? parseDaily(x.body).items.map((i) => i.title).join(' ') : '',
  }));
  return (
    <>
      <Bar />
      <section className="band"><div className="wrap"><h1>뉴스</h1><p>사업에 쓰는 AI와 자동화 소식을 매일 한 호씩 정리합니다.</p></div></section>
      <div className="wrap two">
        <main><Search docs={docs} kind="daily" /></main>
        <Side />
      </div>
      <Foot />
    </>
  );
}

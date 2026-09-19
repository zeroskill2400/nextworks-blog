import { all, daily, parseDaily } from '../../lib/content';
import { Bar, Foot, Side } from '../_parts/Chrome';
import { Search } from '../_parts/Tools';

export default function Archive() {
  const order = daily().map((x) => x.slug).sort();
  const docs = all().map((x) => ({
    kind: x.kind, slug: x.slug, title: x.title, summary: x.summary, date: String(x.date), cover: x.cover || null,
    n: x.kind === 'daily' ? order.indexOf(x.slug) + 1 : null,
    items: x.kind === 'daily' && /^### /m.test(x.body) ? parseDaily(x.body).items.map((i) => i.title).join(' ') : '',
  }));
  return (
    <>
      <Bar />
      <div className="wrap two">
        <main>
          <div className="head">지난 글</div>
          <Search docs={docs} />
        </main>
        <Side />
      </div>
      <Foot />
    </>
  );
}

import { daily, posts, parseDaily, longDate, shortDate } from '../lib/content';
import { Bar, Foot, Side, Top } from './_parts/Chrome';
import { Banner } from './_parts/Banner';

const cut = (t, n) => (t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…');

export default function Home() {
  const news = daily();
  const top = news[0];
  const order = news.map((x) => x.slug).sort();
  const no = (slug) => order.indexOf(slug) + 1;
  const parsed = top && /^### /m.test(top.body) ? parseDaily(top.body) : null;
  const items = parsed ? parsed.items.slice(0, 5) : [];
  const slides = parsed ? parsed.items.map((it) => ({ n: it.n, title: it.title, section: it.section,
    lead: cut((it.lead[0] || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), 120) })) : [];
  const rows = [
    ...news.map((x) => ({ kind: 'daily', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: `/og/${x.slug}-thumb.png`, tag: `${no(x.slug)}호` })),
    ...posts().map((x) => ({ kind: 'posts', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: x.cover, tag: '기록' })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <Bar />
      {top && <Banner slides={slides} slug={top.slug} no={no(top.slug)} date={longDate(top.date)} />}

      <div className="wrap two">
        <main>
          {rows.map((x) => (
            <article className="row" key={`${x.kind}-${x.slug}`}>
              <div className="t">
                <h2><a href={`/${x.kind}/${x.slug}`}>{x.title}</a></h2>
                <p>{x.summary}</p>
                <div className="sub">{shortDate(x.date)}<span>·</span><b>{x.tag}</b></div>
              </div>
              {x.pic && <a className="pic" href={`/${x.kind}/${x.slug}`}><img src={x.pic} alt="" /></a>}
            </article>
          ))}
        </main>
        <Side top={top ? <Top slug={top.slug} items={items} /> : null} />
      </div>
      <Foot />
    </>
  );
}

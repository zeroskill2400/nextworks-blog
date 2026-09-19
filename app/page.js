import { daily, posts, parseDaily, longDate, shortDate } from '../lib/content';
import { Bar, Foot, Side, Top } from './_parts/Chrome';

export default function Home() {
  const news = daily();
  const top = news[0];
  const order = news.map((x) => x.slug).sort();
  const no = (slug) => order.indexOf(slug) + 1;
  const items = top && /^### /m.test(top.body) ? parseDaily(top.body).items.slice(0, 5) : [];
  const rows = [
    ...news.map((x) => ({ kind: 'daily', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: `/og/${x.slug}-thumb.png`, tag: `${no(x.slug)}호` })),
    ...posts().map((x) => ({ kind: 'posts', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: x.cover, tag: '기록' })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <Bar />
      {top && (
        <section className="today">
          <div className="wrap">
            <div className="when">{longDate(top.date)}<em>{no(top.slug)}호</em></div>
            <h1><a href={`/daily/${top.slug}`}>{top.title}</a></h1>
            <p className="gist">{top.summary}</p>
            <a className="more" href={`/daily/${top.slug}`}>오늘 뉴스 전체 읽기</a>
          </div>
        </section>
      )}

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

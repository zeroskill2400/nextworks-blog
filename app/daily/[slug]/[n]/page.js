import { daily, one, parseDaily, longDate } from '../../../../lib/content';
import { Bar, Foot } from '../../../_parts/Chrome';

export function generateStaticParams() {
  return daily().filter((x) => /^### /m.test(x.body)).flatMap((x) =>
    parseDaily(x.body).items.map((it) => ({ slug: x.slug, n: String(it.n) })));
}

export async function generateMetadata({ params }) {
  const { slug, n } = await params;
  const doc = one('daily', slug);
  if (!doc) return {};
  const it = parseDaily(doc.body).items.find((x) => String(x.n) === n);
  if (!it) return {};
  const desc = it.lead[0] ? it.lead[0].replace(/<[^>]+>/g, '').slice(0, 150) : doc.summary;
  return { title: it.title, description: desc,
    openGraph: { type: 'article', title: it.title, description: desc, url: `/daily/${slug}/${n}`,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630 }] } };
}

export default async function Page({ params }) {
  const { slug, n } = await params;
  const doc = one('daily', slug);
  if (!doc) return null;
  const d = parseDaily(doc.body);
  const it = d.items.find((x) => String(x.n) === n);
  if (!it) return null;
  const prev = d.items.find((x) => x.n === it.n - 1);
  const next = d.items.find((x) => x.n === it.n + 1);

  return (
    <>
      <Bar />
      <article className="wrap story">
        <div className="crumb">
          <a href={`/daily/${slug}`}>{longDate(doc.date)} 뉴스</a>
          <span>{it.section}</span>
          <span>{it.n} / {d.items.length}</span>
        </div>
        <h1>{it.title}</h1>
        {it.lead.map((p, i) => <p key={i} className="lead" dangerouslySetInnerHTML={{ __html: p }} />)}
        {it.bullets.length > 0 && (
          <ul>{it.bullets.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: b }} />)}</ul>
        )}
        {it.detail.length > 0 && (
          <section className="more">
            <h2>자세히</h2>
            {it.detail.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
          </section>
        )}
        {it.judge.length > 0 && (
          <dl className="judge">
            {it.judge.map((j, i) => (
              <div key={i}><dt>{j.k}</dt><dd dangerouslySetInnerHTML={{ __html: j.v }} /></div>
            ))}
          </dl>
        )}
        {it.links.length > 0 && (
          <div className="go">
            {it.links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noopener">{l.name} ↗</a>)}
          </div>
        )}
        <nav className="pn">
          {prev ? <a className="p" href={`/daily/${slug}/${prev.n}`}><small>이전</small>{prev.title}</a> : <span />}
          {next ? <a className="n" href={`/daily/${slug}/${next.n}`}><small>다음</small>{next.title}</a> : <span />}
        </nav>
        <a className="back" href={`/daily/${slug}`}>오늘 뉴스 전체로</a>
      </article>
      <Foot />
    </>
  );
}

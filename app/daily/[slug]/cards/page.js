import { daily, one, parseDaily, longDate, kindOf, shareText, issueNo } from '../../../../lib/content';
import { Bar, Foot } from '../../../_parts/Chrome';
import { Ask, Share, Filter } from '../../../_parts/Tools';

const BASE = 'https://nextworks-blog.vercel.app';

export function generateStaticParams() {
  return daily().filter((x) => /^### /m.test(x.body)).map((x) => ({ slug: x.slug }));
}

function Card({ it, feature, slug, kind }) {
  const main = it.links[0];
  const href = `/daily/${slug}/${it.n}`;
  const first = it.judge[0];
  const rest = it.judge.slice(1);
  return (
    <article className={`card${feature ? ' feature' : ''}`} id={it.id} data-kind={kind}>
      {main && <div className="tag">{main.name}</div>}
      <h3><a href={href}>{it.title}</a></h3>
      {it.lead[0] && <p className="lead" dangerouslySetInnerHTML={{ __html: it.lead[0] }} />}
      {feature && it.bullets.length > 0 && (
        <ul>{it.bullets.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: b }} />)}</ul>
      )}
      {first && (
        <div className="take">
          <b>{first.k}</b>
          <span dangerouslySetInnerHTML={{ __html: first.v }} />
        </div>
      )}
      {rest.map((j, i) => (
        <div className="take sub" key={i}>
          <b>{j.k}</b>
          <span dangerouslySetInnerHTML={{ __html: j.v }} />
        </div>
      ))}
      <div className="foot">
        <a className="in" href={href}>자세히 읽기</a>
        {it.links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noopener">{l.name} ↗</a>)}
        <Ask title={it.title} url={`${BASE}${href}`} />
      </div>
    </article>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = one('daily', slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary,
    openGraph: { type: 'article', title: doc.title, description: doc.summary, url: `/daily/${slug}`,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630 }] } };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = one('daily', slug);
  if (!doc) return null;
  const d = parseDaily(doc.body);
  const [lead, ...others] = d.sections;
  const no = issueNo(slug);
  const kinds = Object.fromEntries(d.sections.flatMap((s) => s.items.map((it) => [it.id, kindOf(it, s.title)])));
  const counts = { all: d.items.length + (d.programs ? 1 : 0) };
  Object.values(kinds).forEach((k) => { counts[k] = (counts[k] || 0) + 1; });
  if (d.programs) counts.program = (counts.program || 0) + 1;

  return (
    <>
      <Bar />
      <div className="wrap cards">
        <header className="top">
          <div className="when">{longDate(doc.date)}<em>{no}호</em></div>
          <h1>{doc.title}</h1>
          <p className="gist">{doc.summary}</p>
        </header>

        <Filter counts={counts} />

        {lead && lead.items[0] && <div data-sec><Card it={lead.items[0]} feature slug={slug} kind={kinds[lead.items[0].id]} /></div>}

        {others.map((s, i) => (
          <section className="grp" key={i} data-sec>
            <h2>{s.title}</h2>
            <div className="grid">
              {s.items.map((it) => <Card key={it.id} it={it} slug={slug} kind={kinds[it.id]} />)}
            </div>
          </section>
        ))}

        {d.programs && (
          <section className="grp" id="programs" data-sec data-kind="program">
            <h2>{d.programs.title}</h2>
            <div className="card wide">
              {d.programs.note && <p className="lead">{d.programs.note}</p>}
              <table className="prog">
                <thead><tr><th>사업명</th><th>주관</th><th>기간</th></tr></thead>
                <tbody>
                  {d.programs.rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.url ? <a href={r.url} target="_blank" rel="noopener">{r.name}</a> : r.name}</td>
                      <td>{r.org}</td>
                      <td>{r.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <Share title={doc.title} text={shareText(doc, d, no)} url={`${BASE}/daily/${slug}`} />
        <a className="back" href={`/daily/${slug}`}>글 형식으로 보기</a>
      </div>
      <Foot />
    </>
  );
}

import { daily, one, parseDaily, longDate } from '../../../../lib/content';
import { Bar, Foot } from '../../../_parts/Chrome';

export function generateStaticParams() {
  return daily().filter((x) => /^### /m.test(x.body)).map((x) => ({ slug: x.slug }));
}

function Card({ it, feature, slug }) {
  const main = it.links[0];
  const href = `/daily/${slug}/${it.n}`;
  const first = it.judge[0];
  const rest = it.judge.slice(1);
  return (
    <article className={`card${feature ? ' feature' : ''}`} id={it.id}>
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
      </div>
    </article>
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = one('daily', slug);
  if (!doc) return null;
  const d = parseDaily(doc.body);
  const [lead, ...others] = d.sections;

  return (
    <>
      <Bar />
      <div className="wrap cards">
        <header className="top">
          <div className="when">{longDate(doc.date)}</div>
          <h1>{doc.title}</h1>
          <p className="gist">{doc.summary}</p>
        </header>

        {lead && lead.items[0] && <Card it={lead.items[0]} feature slug={slug} />}

        {others.map((s, i) => (
          <section className="grp" key={i}>
            <h2>{s.title}</h2>
            <div className="grid">
              {s.items.map((it) => <Card key={it.id} it={it} slug={slug} />)}
            </div>
          </section>
        ))}

        {d.programs && (
          <section className="grp" id="programs">
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

        <a className="back" href={`/daily/${slug}`}>글 형식으로 보기</a>
      </div>
      <Foot />
    </>
  );
}

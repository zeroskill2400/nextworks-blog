import { daily, one, html, parseDaily, longDate } from '../../../lib/content';
import { Bar, Foot } from '../../_parts/Chrome';

export function generateStaticParams() {
  return daily().map((x) => ({ slug: x.slug }));
}

function Item({ it }) {
  return (
    <article className="it" id={it.id}>
      {it.source && (
        <div className="src">
          <a href={it.source.url} target="_blank" rel="noopener">{it.source.name} 원문</a>
        </div>
      )}
      <h3>{it.title}</h3>
      {it.lead.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
      {it.bullets.length > 0 && (
        <ul>{it.bullets.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: b }} />)}</ul>
      )}
      {it.judge.length > 0 && (
        <dl className="judge">
          {it.judge.map((j, i) => (
            <div key={i}>
              <dt>{j.k}</dt>
              <dd dangerouslySetInnerHTML={{ __html: j.v }} />
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = one('daily', slug);
  if (!doc) return null;
  const structured = /^### /m.test(doc.body);
  const d = structured ? parseDaily(doc.body) : null;
  const allItems = d ? d.sections.flatMap((s) => s.items) : [];

  return (
    <>
      <Bar />
      <article className="wrap doc">
        <div className="when">{longDate(doc.date)}</div>
        <h1>{doc.title}</h1>
        <p className="gist">{doc.summary}</p>

        {d ? (
          <>
            <nav className="toc" aria-label="오늘 담긴 것">
              <div className="sh">오늘 담긴 것 {allItems.length}건{d.programs ? `, 지원사업 ${d.programs.rows.length}건` : ''}</div>
              <ol>
                {allItems.map((it) => (
                  <li key={it.id}>
                    <a href={`#${it.id}`}>{it.title}</a>
                    {it.source && <span>{it.source.name}</span>}
                  </li>
                ))}
                {d.programs && <li><a href="#programs">{d.programs.title}</a><span>기업마당</span></li>}
              </ol>
            </nav>

            {d.sections.map((s, i) => (
              <section className="sec" key={i}>
                <h2>{s.title}</h2>
                {s.items.map((it) => <Item key={it.id} it={it} />)}
              </section>
            ))}

            {d.programs && (
              <section className="sec" id="programs">
                <h2>{d.programs.title}</h2>
                {d.programs.note && <p className="note">{d.programs.note}</p>}
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
              </section>
            )}
          </>
        ) : (
          <div className="md" dangerouslySetInnerHTML={{ __html: html(doc.body) }} />
        )}

        <a className="back" href="/">목록으로</a>
      </article>
      <Foot />
    </>
  );
}

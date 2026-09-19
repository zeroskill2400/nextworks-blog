import { daily, one, html, parseDaily, longDate, kindOf, shareText, issueNo } from '../../../lib/content';
import { Bar, Foot } from '../../_parts/Chrome';
import { Ask, Share, Filter } from '../../_parts/Tools';

const BASE = 'https://nextworks-blog.vercel.app';

export function generateStaticParams() {
  return daily().map((x) => ({ slug: x.slug }));
}

function Item({ it, slug, kind }) {
  const href = `/daily/${slug}/${it.n}`;
  return (
    <article className="it" id={it.id} data-kind={kind}>
      <h3><a href={href}>{it.title}</a></h3>
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
      <div className="go">
        <a className="in" href={href}>자세히 읽기</a>
        {it.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener">{l.name} ↗</a>
        ))}
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
  const structured = /^### /m.test(doc.body);
  const d = structured ? parseDaily(doc.body) : null;
  const allItems = d ? d.sections.flatMap((s) => s.items) : [];
  const no = issueNo(slug);
  const kinds = d ? Object.fromEntries(d.sections.flatMap((s) => s.items.map((it) => [it.id, kindOf(it, s.title)]))) : {};
  const counts = { all: allItems.length + (d && d.programs ? 1 : 0) };
  Object.values(kinds).forEach((k) => { counts[k] = (counts[k] || 0) + 1; });
  if (d && d.programs) counts.program = (counts.program || 0) + 1;

  return (
    <>
      <Bar />
      <article className="wrap doc">
        <div className="when">{longDate(doc.date)}<em>{no}호</em></div>
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
                    {it.links[0] && <span>{it.links[0].name}</span>}
                  </li>
                ))}
                {d.programs && <li><a href="#programs">{d.programs.title}</a><span>기업마당</span></li>}
              </ol>
            </nav>

            <Filter counts={counts} />

            {d.sections.map((s, i) => (
              <section className="sec" key={i} data-sec>
                <h2>{s.title}</h2>
                {s.items.map((it) => <Item key={it.id} it={it} slug={slug} kind={kinds[it.id]} />)}
              </section>
            ))}

            {d.programs && (
              <section className="sec" id="programs" data-sec data-kind="program">
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

            <Share title={doc.title} text={shareText(doc, d, no)} url={`${BASE}/daily/${slug}`} />
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

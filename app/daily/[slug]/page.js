import { daily, one, html, longDate } from '../../../lib/content';
import { Bar, Foot } from '../../_parts/Chrome';

export function generateStaticParams() {
  return daily().map((x) => ({ slug: x.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = one('daily', slug);
  if (!doc) return null;
  return (
    <>
      <Bar />
      <article className="wrap doc">
        <div className="when">{longDate(doc.date)}</div>
        <h1>{doc.title}</h1>
        <p className="gist">{doc.summary}</p>
        <div className="md" dangerouslySetInnerHTML={{ __html: html(doc.body) }} />
        <a className="back" href="/">목록으로</a>
      </article>
      <Foot />
    </>
  );
}

import { posts, one, html, longDate } from '../../../lib/content';
import { Bar, Foot } from '../../_parts/Chrome';

export function generateStaticParams() {
  return posts().map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = one('posts', slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.summary,
    openGraph: { type: 'article', title: doc.title, description: doc.summary, url: `/posts/${slug}`,
      images: [{ url: doc.cover || '/og/default.png', width: 1200, height: 630 }] } };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = one('posts', slug);
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

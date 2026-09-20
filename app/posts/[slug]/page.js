import { posts, one, html, longDate } from '../../../lib/content';
import { Bar, Foot } from '../../_parts/Chrome';

export function generateStaticParams() {
  const list = posts().map((x) => ({ slug: x.slug }));
  // 정적 내보내기는 경로가 하나는 있어야 한다. 공개된 기록이 없으면 안내 페이지 하나만 만든다
  return list.length ? list : [{ slug: 'soon' }];
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
  if (!doc) {
    return (
      <>
        <Bar />
        <article className="wrap doc">
          <h1>기록을 준비하고 있습니다</h1>
          <p className="gist">직접 만들며 남긴 것을 제대로 써서 올립니다. 뉴스는 매일 나옵니다.</p>
          <a className="back" href="/">홈으로</a>
        </article>
        <Foot />
      </>
    );
  }
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

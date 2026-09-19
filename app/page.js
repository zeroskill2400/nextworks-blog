import { daily, posts, longDate, shortDate } from '../lib/content';
import { Bar, Foot, Side } from './_parts/Chrome';

export default function Home() {
  const news = daily();
  const top = news[0];
  const older = news.slice(1);
  const order = news.map((x) => x.slug).sort();
  const no = (slug) => order.indexOf(slug) + 1;

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

      <div className="wrap home2">
        <main>
          <section className="block">
            <div className="head"><span>지난 뉴스</span><a href="/archive">전체 보기</a></div>
            {older.length ? (
              <ol className="nl">
                {older.map((x) => (
                  <li key={x.slug}><time>{shortDate(x.date)}</time><a href={`/daily/${x.slug}`}>{x.title}</a><em>{no(x.slug)}호</em></li>
                ))}
              </ol>
            ) : (
              <p className="note">1호가 방금 나왔습니다. 매일 한 호씩 쌓입니다.</p>
            )}
          </section>

          <section className="block">
            <div className="head"><span>기록 · 직접 만들며 남긴 것</span><a href="/archive#posts">전체 보기</a></div>
            {posts().map((x) => (
              <article className="row" key={x.slug}>
                <div className="t">
                  <h2><a href={`/posts/${x.slug}`}>{x.title}</a></h2>
                  <p>{x.summary}</p>
                  <div className="sub">{shortDate(x.date)}</div>
                </div>
                {x.cover && <div className="pic"><img src={x.cover} alt="" /></div>}
              </article>
            ))}
          </section>
        </main>
        <Side />
      </div>
      <Foot />
    </>
  );
}

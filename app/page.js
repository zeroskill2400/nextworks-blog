import { daily, all, longDate, shortDate, KIND } from '../lib/content';
import { Bar, Foot, Side } from './_parts/Chrome';

export default function Home() {
  const news = daily();
  const top = news[0];
  const rest = all().filter((x) => !(top && x.kind === top.kind && x.slug === top.slug));

  return (
    <>
      <Bar />
      {top && (
        <section className="today">
          <div className="wrap">
            <div className="when">{longDate(top.date)}<em>{news.length}호</em></div>
            <h1><a href={`/daily/${top.slug}`}>{top.title}</a></h1>
            <p className="gist">{top.summary}</p>
            <a className="more" href={`/daily/${top.slug}`}>오늘 뉴스 전체 읽기</a>
          </div>
        </section>
      )}

      <div className="wrap two">
        <main>
          <div className="head">최근 글</div>
          {rest.map((x) => (
            <article className="row" key={`${x.kind}-${x.slug}`}>
              <div className="t">
                <h2><a href={`/${x.kind}/${x.slug}`}>{x.title}</a></h2>
                <p>{x.summary}</p>
                <div className="sub">{shortDate(x.date)}<span>·</span><b>{KIND[x.kind]}</b></div>
              </div>
              {x.cover && <div className="pic"><img src={x.cover} alt="" /></div>}
            </article>
          ))}
        </main>
        <Side />
      </div>
      <Foot />
    </>
  );
}

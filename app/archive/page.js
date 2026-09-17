import { all, shortDate, KIND } from '../../lib/content';
import { Bar, Foot, Side } from '../_parts/Chrome';

export default function Archive() {
  return (
    <>
      <Bar />
      <div className="wrap two">
        <main>
          <div className="head">지난 글 전체</div>
          {all().map((x) => (
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

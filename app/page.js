import { daily, posts, parseDaily, longDate, shortDate } from '../lib/content';
import { Bar, Foot, Side, Top } from './_parts/Chrome';
import { Banner } from './_parts/Banner';
import PALS from '../lib/palettes.json';

const cut = (t, n) => (t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…');

export default function Home() {
  const news = daily();
  const top = news[0];
  const order = news.map((x) => x.slug).sort();
  const no = (slug) => order.indexOf(slug) + 1;
  const parsed = top && /^### /m.test(top.body) ? parseDaily(top.body) : null;
  const items = parsed ? parsed.items.slice(0, 5) : [];
  const progCount = parsed && parsed.programs ? parsed.programs.rows.length : 0;
  const SITE = 'https://nextworks-kr.vercel.app';
  const slides = [
    top && {
      tone: 'blue', pal: PALS[(no(top.slug) - 1) % PALS.length], kicker: `오늘 뉴스 · ${longDate(top.date)} · ${no(top.slug)}호`,
      title: top.title, lead: cut(top.summary, 110), href: `/daily/${top.slug}`, cta: '오늘 뉴스 전체 읽기',
    },
    {
      tone: 'ink', kicker: '넥스트웍스 · 사장님과 실무자를 위해',
      title: '매일 사람이 붙어야 돌아가던 일을 붙지 않아도 돌게 만듭니다',
      lead: '엑셀 집계, 손으로 옮기던 주문, 누군가 확인해야 넘어가던 업무를 프로그램이 대신 합니다. 기획부터 개발, 배포, 인계까지 한 곳에서 끝냅니다.',
      href: SITE, ext: true, cta: '무엇부터 줄일지 이야기하기',
    },
    {
      tone: 'paper', kicker: '직접 만든 것',
      title: '기획과 디자인, 개발을 전부 직접 한 실제 결과물',
      shots: [
        { src: '/shots/kinet.png', alt: '산업용 로봇 제품 사이트' },
        { src: '/shots/orderdesk.png', alt: '거래처 주문 백오피스' },
        { src: '/shots/ourframe.png', alt: '촬영 매칭 서비스' },
        { src: '/shots/myeongwoldang.png', alt: '사주 체험 웹' },
      ],
      href: `${SITE}/#works`, ext: true, cta: '만든 것 보기',
    },
    progCount > 0 && top && {
      tone: 'blue2', pal: PALS[5], kicker: '오늘 뜬 지원사업',
      title: `기업마당에 오늘 올라온 공고 중 ${progCount}건을 골랐습니다`,
      lead: '전국 단위와 온라인 판로, IT·디지털 관련만 추립니다. 사업명을 누르면 공고로 바로 갑니다.',
      href: `/daily/${top.slug}#programs`, cta: '지원사업 보기',
    },
  ].filter(Boolean);
  const rows = [
    ...news.map((x) => ({ kind: 'daily', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: `/og/${x.slug}-thumb.png`, tag: `${no(x.slug)}호` })),
    ...posts().map((x) => ({ kind: 'posts', slug: x.slug, title: x.title, summary: x.summary, date: x.date, pic: x.cover, tag: '기록' })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <Bar />
      <Banner slides={slides} />

      <div className="wrap two">
        <main>
          {rows.map((x) => (
            <article className="row" key={`${x.kind}-${x.slug}`}>
              <div className="t">
                <h2><a href={`/${x.kind}/${x.slug}`}>{x.title}</a></h2>
                <p>{x.summary}</p>
                <div className="sub">{shortDate(x.date)}<span>·</span><b>{x.tag}</b></div>
              </div>
              {x.pic && <a className="pic" href={`/${x.kind}/${x.slug}`}><img src={x.pic} alt="" /></a>}
            </article>
          ))}
        </main>
        <Side top={top ? <Top slug={top.slug} items={items} /> : null} />
      </div>
      <Foot />
    </>
  );
}

import { Nav } from './Nav';

const SITE = 'https://nextworks-kr.vercel.app';
export const KAKAO = 'https://open.kakao.com/o/sSxg1ANi';
export const MAIL = 'zeroskill2400@gmail.com';

export function Bar() {
  return (
    <header className="bar">
      <div className="wrap in">
        <a className="sig" href="/">넥스트<i>웍스</i> 기록</a>
        <Nav />
        <form className="q" action="/news" method="get" role="search">
          <input type="search" name="q" placeholder="뉴스에서 검색" aria-label="뉴스에서 검색" />
        </form>
        <a className="out" href={SITE}>작업 문의</a>
      </div>
    </header>
  );
}

export function Foot() {
  return (
    <footer className="foot">
      <div className="wrap in">
        <span>넥스트웍스 · 김범수</span>
        <span className="rt">
          <a href={SITE}>회사 소개</a>
          <a href="https://github.com/zeroskill2400">GitHub</a>
          <a href={`mailto:${MAIL}`}>{MAIL}</a>
        </span>
      </div>
    </footer>
  );
}

export function Top({ slug, items }) {
  if (!items || !items.length) return null;
  return (
    <div className="box top5">
      <div className="sh">오늘 담긴 것</div>
      <ol>
        {items.map((it) => <li key={it.n}><a href={`/daily/${slug}/${it.n}`}>{it.title}</a></li>)}
      </ol>
    </div>
  );
}

export function Side({ top }) {
  return (
    <aside className="side">
      {top}
      <div className="box">
        <div className="who">
          <span className="dot" />
          <span><b>김범수</b><span>넥스트웍스 · 서울</span></span>
        </div>
        <p>결제와 정산처럼 틀리면 안 되는 시스템을 만들어 왔습니다. 매일 손으로 하던 일을 프로그램으로 바꾸는 일을 합니다.</p>
        <a className="to" href={SITE}>작업 문의하기</a>
        <a className="mail" href={`mailto:${MAIL}?subject=${encodeURIComponent('작업 문의')}`}>{MAIL}</a>
      </div>
      <div className="box talk">
        <div className="sh">읽다가 궁금한 것이 있으면</div>
        <p>이 도구를 우리 회사에도 붙일 수 있는지, 얼마나 걸리는지 같은 질문은 카카오톡으로 바로 물어보셔도 됩니다.</p>
        <a className="to" href={KAKAO}>카카오톡으로 물어보기</a>
      </div>
    </aside>
  );
}

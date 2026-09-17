const SITE = 'https://nextworks-kr.vercel.app';

export function Bar() {
  return (
    <header className="bar">
      <div className="wrap in">
        <a className="sig" href="/">넥스트<i>웍스</i> 기록</a>
        <nav>
          <a href="/">오늘의 뉴스</a>
          <a href="/archive">지난 글</a>
        </nav>
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
        </span>
      </div>
    </footer>
  );
}

export function Side() {
  return (
    <aside className="side">
      <div className="box">
        <div className="who">
          <span className="dot" />
          <span><b>김범수</b><span>넥스트웍스 · 서울</span></span>
        </div>
        <p>결제와 정산처럼 틀리면 안 되는 시스템을 만들어 왔습니다. 매일 손으로 하던 일을 프로그램으로 바꾸는 일을 합니다.</p>
        <a className="to" href={SITE}>작업 문의하기</a>
      </div>
      <div className="box talk">
        <div className="sh">매일 아침 카톡으로</div>
        <p>정리한 뉴스를 오픈채팅방에 올립니다. 읽다가 궁금한 건 바로 물어보셔도 됩니다.</p>
        <a className="to" href="#">오픈채팅 참여하기</a>
      </div>
    </aside>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

/* 홈 상단 배너: 오늘 호의 꼭지가 한 장씩 넘어간다 (D2의 상단 배너 자리) */
export function Banner({ slides, slug, no, date }) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const n = slides.length;
  const timer = useRef(null);
  useEffect(() => {
    if (pause || n < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(timer.current);
  }, [pause, n]);
  if (!n) return null;
  const s = slides[i];
  return (
    <section className="banner" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} aria-roledescription="carousel">
      <div className="wrap in">
        <button type="button" className="arr l" aria-label="이전" onClick={() => setI((i - 1 + n) % n)}>‹</button>
        <a className="slide" href={`/daily/${slug}/${s.n}`} key={s.n}>
          <div className="k">{date} · {no}호 · {s.section}</div>
          <h2>{s.title}</h2>
          <p>{s.lead}</p>
          <span className="go">기사 읽기</span>
        </a>
        <button type="button" className="arr r" aria-label="다음" onClick={() => setI((i + 1) % n)}>›</button>
      </div>
      <div className="dots" role="tablist">
        {slides.map((x, k) => (
          <button type="button" role="tab" key={x.n} aria-selected={k === i} aria-label={`${k + 1}번째`} className={k === i ? 'on' : ''} onClick={() => setI(k)} />
        ))}
      </div>
    </section>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

/* 홈 상단 배너. D2의 상단 배너 자리: 오늘 뉴스 한 장 + 우리 자산으로 보내는 고정 판들 */
export function Banner({ slides }) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const n = slides.length;
  const timer = useRef(null);
  useEffect(() => {
    if (pause || n < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % n), 7000);
    return () => clearInterval(timer.current);
  }, [pause, n]);
  if (!n) return null;
  const s = slides[i];
  return (
    <section className={`banner ${s.tone || 'blue'}${s.pal ? ' mesh' : ''}`} style={s.pal ? { '--a': s.pal.a, '--b': s.pal.b, '--c': s.pal.c } : undefined} onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} aria-roledescription="carousel">
      <div className="wrap in">
        <button type="button" className="arr l" aria-label="이전" onClick={() => setI((i - 1 + n) % n)}>‹</button>
        <a className="slide" href={s.href} target={s.ext ? '_blank' : undefined} rel={s.ext ? 'noopener' : undefined} key={i}>
          <div className="k">{s.kicker}</div>
          <h2>{s.title}</h2>
          {s.lead && <p>{s.lead}</p>}
          {s.shots && (
            <div className="shots">
              {s.shots.map((sh) => <img key={sh.src} src={sh.src} alt={sh.alt} />)}
            </div>
          )}
          <span className="go">{s.cta}</span>
        </a>
        <button type="button" className="arr r" aria-label="다음" onClick={() => setI((i + 1) % n)}>›</button>
      </div>
      <div className="dots" role="tablist">
        {slides.map((x, k) => (
          <button type="button" role="tab" key={k} aria-selected={k === i} aria-label={x.kicker} className={k === i ? 'on' : ''} onClick={() => setI(k)} />
        ))}
      </div>
    </section>
  );
}

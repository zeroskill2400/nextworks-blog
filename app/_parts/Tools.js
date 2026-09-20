'use client';
import { useEffect, useMemo, useState } from 'react';
import { KAKAO } from '../../lib/links';

/* 클립보드 복사 (실패해도 조용히) */
async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/* 꼭지 아래: 이거 우리 회사에도 되나요 → 제목을 복사해 두고 카카오 1:1을 연다 */
export function Ask({ title, url }) {
  const [done, setDone] = useState(false);
  const msg = `"${title}" 이거 저희 회사에도 붙일 수 있을까요?\n${url}`;
  return (
    <button
      type="button"
      className={`ask${done ? ' done' : ''}`}
      onClick={async () => {
        await copy(msg);
        setDone(true);
        window.open(KAKAO, '_blank', 'noopener');
        setTimeout(() => setDone(false), 4000);
      }}
      aria-label="이 도구를 우리 회사에 적용할 수 있는지 카카오톡으로 묻기"
    >
      {done ? '질문을 복사했습니다. 카카오톡에 붙여 넣으세요' : '우리 회사에도 되나요? 물어보기'}
    </button>
  );
}

/* 호 아래: 공유 텍스트 + 카카오톡·기기 공유 */
export function Share({ text, url, title }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('');
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  return (
    <div className="share">
      <div className="row">
        <button type="button" className="pri" onClick={async () => {
          if (navigator.share) {
            try { await navigator.share({ title, text, url }); return; } catch { /* 취소 */ }
          }
          const ok = await copy(`${text}\n${url}`);
          setState(ok ? '복사했습니다. 카카오톡에 붙여 넣으세요' : '복사가 막혔습니다. 아래 글을 직접 복사하세요');
          setOpen(true);
          setTimeout(() => setState(''), 4000);
        }}>{canShare ? '카카오톡으로 공유' : '공유 텍스트 복사'}</button>
        <button type="button" onClick={() => setOpen((v) => !v)}>{open ? '공유 텍스트 접기' : '공유 텍스트 펼치기'}</button>
        {state && <span className="st">{state}</span>}
      </div>
      {open && <textarea readOnly value={`${text}\n${url}`} rows={Math.min(14, text.split('\n').length + 2)} onFocus={(e) => e.target.select()} />}
    </div>
  );
}

/* 출처 필터: data-kind 를 가진 꼭지를 보이거나 숨긴다 */
const KINDS = [
  ['all', '전체'], ['tool', '도구'], ['release', '발표·기사'], ['kr', '국내'], ['program', '지원사업'],
];
export function Filter({ counts }) {
  const [kind, setKind] = useState('all');
  useEffect(() => {
    document.querySelectorAll('[data-kind]').forEach((el) => {
      el.hidden = kind !== 'all' && el.dataset.kind !== kind;
    });
    document.querySelectorAll('[data-sec]').forEach((sec) => {
      const any = [...sec.querySelectorAll('[data-kind]')].some((el) => !el.hidden);
      sec.hidden = !any;
    });
  }, [kind]);
  return (
    <div className="filter" role="group" aria-label="출처로 걸러 보기">
      {KINDS.filter(([k]) => k === 'all' || counts[k]).map(([k, label]) => (
        <button type="button" key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>
          {label}<b>{k === 'all' ? counts.all : counts[k]}</b>
        </button>
      ))}
    </div>
  );
}

/* 아카이브 검색 */
export function Search({ docs, kind: fixed }) {
  const [q, setQ] = useState('');
  const [month, setMonth] = useState('');
  const [kind, setKind] = useState(fixed || 'daily');
  useEffect(() => {
    const u = new URL(location.href);
    if (u.searchParams.get('q')) setQ(u.searchParams.get('q'));
    if (!fixed && location.hash === '#posts') setKind('posts');
  }, [fixed]);
  const months = useMemo(() => [...new Set(docs.map((d) => d.date.slice(0, 7)))], [docs]);
  const hit = useMemo(() => {
    const t = q.trim().toLowerCase();
    return docs.filter((d) => d.kind === kind && (!month || d.date.startsWith(month)) &&
      (!t || `${d.title} ${d.summary} ${d.items || ''}`.toLowerCase().includes(t)));
  }, [docs, q, month, kind]);
  const cnt = (k) => docs.filter((d) => d.kind === k).length;
  return (
    <div className="arch">
      {!fixed && (
        <div className="tabs" role="tablist">
          <button type="button" role="tab" className={kind === 'daily' ? 'on' : ''} onClick={() => setKind('daily')}>뉴스 {cnt('daily')}</button>
          <button type="button" role="tab" className={kind === 'posts' ? 'on' : ''} onClick={() => setKind('posts')}>기록 {cnt('posts')}</button>
        </div>
      )}
      <div className="bar2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목, 요약, 꼭지 제목에서 찾기" aria-label="검색" />
        <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="월 선택">
          <option value="">전체 기간</option>
          {months.map((m) => <option key={m} value={m}>{m.replace('-', '년 ')}월</option>)}
        </select>
      </div>
      <div className="cnt">{hit.length}건</div>
      {hit.map((x) => (
        <article className="row" key={`${x.kind}-${x.slug}`}>
          <div className="t">
            <h2><a href={`/${x.kind}/${x.slug}`}>{x.title}</a></h2>
            <p>{x.summary}</p>
            <div className="sub">{x.date.replace(/-/g, '.')}{x.n ? <span className="n">{x.n}호</span> : null}</div>
          </div>
          {x.cover && <a className="pic" href={`/${x.kind}/${x.slug}`}><img src={x.cover} alt="" /></a>}
        </article>
      ))}
    </div>
  );
}

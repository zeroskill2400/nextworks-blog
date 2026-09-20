'use client';
import { useEffect, useState } from 'react';

const KAKAO = 'https://open.kakao.com/o/sSxg1ANi';
const MAIL = 'zeroskill2400@gmail.com';

const CHIPS = [
  ['개발·자동화 문의', '매일 손으로 하는 일이 있는데 프로그램으로 바꿀 수 있을지 여쭤봅니다.'],
  ['견적이 궁금합니다', '이런 걸 만들면 비용과 기간이 어느 정도인지 여쭤봅니다.'],
  ['홈페이지·소개 페이지', '회사 홈페이지를 새로 만들거나 손보고 싶습니다.'],
  ['운영 중인 시스템 손보기', '만든 사람과 연락이 끊긴 시스템이 있는데 이어받아 주실 수 있는지요.'],
];

async function copy(t) { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } }

/* 오른쪽 아래 고정 문의 버튼 (채널톡 자리). 서버 없이 카카오 1:1과 메일로 넘긴다. */
export function Talk({ who = '넥스트웍스' }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const go = async (text) => {
    const page = typeof location !== 'undefined' ? `\n(보던 페이지: ${location.href})` : '';
    const ok = await copy(text + page);
    setMsg(ok ? '문장을 복사했습니다. 카카오톡에 붙여 넣고 보내시면 됩니다.' : '카카오톡 창을 열었습니다.');
    window.open(KAKAO, '_blank', 'noopener');
    setTimeout(() => setMsg(''), 5000);
  };
  return (
    <div className="talk-root">
      {open && (
        <div className="talk-panel" role="dialog" aria-label={`${who}에 물어보기`}>
          <div className="hd">
            <div>
              <b>{who}에 물어보기</b>
              <span>보통 하루 안에 답합니다</span>
            </div>
            <button type="button" className="x" aria-label="닫기" onClick={() => setOpen(false)}>×</button>
          </div>
          <p className="intro">무엇을 만들어야 할지 몰라도 괜찮습니다. 지금 손이 가장 많이 가는 일 하나만 적어 주세요.</p>
          <div className="chips">
            {CHIPS.map(([label, text]) => (
              <button type="button" key={label} onClick={() => go(text)}>{label}</button>
            ))}
          </div>
          <div className="ways">
            <a className="kk" href={KAKAO} target="_blank" rel="noopener">카카오톡으로 바로 말하기</a>
            <a href={`mailto:${MAIL}?subject=${encodeURIComponent('작업 문의')}`}>이메일로 보내기</a>
          </div>
          {msg && <div className="st">{msg}</div>}
        </div>
      )}
      <button type="button" className={`talk-fab${open ? ' on' : ''}`} aria-expanded={open} aria-label={open ? '문의 창 닫기' : '문의하기'} onClick={() => setOpen((v) => !v)}>
        {open ? '×' : '문의'}
      </button>
    </div>
  );
}

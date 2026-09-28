import React, { useEffect, useRef, useState } from 'react';
import { gateOutput, LOGIC_LEVELS, signalAt } from './logic-gates';
import { MAZES, mazeEdges } from './logic-maze';

function gateLabel([gate, other]) {
  return gate === 'NOT' ? 'NOT' : `${gate} · ${other}`;
}

function position([x, y], width, height) {
  return { left: `${x / width * 100}%`, top: `${y / height * 100}%` };
}

export default function LogicGame({ onHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [picks, setPicks] = useState([]);
  const [result, setResult] = useState(null);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 720px)').matches);
  const title = useRef(null);
  const level = LOGIC_LEVELS[levelIndex];
  const map = compact ? MAZES[levelIndex].mobile : MAZES[levelIndex];
  const width = compact ? 600 : 1000;
  const height = compact ? 1000 : 600;
  const signal = signalAt(level, picks);
  const complete = levelIndex === LOGIC_LEVELS.length - 1;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  function choose(stage, option) {
    if (stage !== picks.length || result) return;
    const nextPicks = [...picks, option];
    setPicks(nextPicks);
    if (nextPicks.length === level.paths.length) setResult(signalAt(level, nextPicks) === 1 ? 'lit' : 'dark');
  }

  function reset() {
    setPicks([]);
    setResult(null);
  }

  function next() {
    setLevelIndex(levelIndex + 1);
    reset();
    title.current?.focus();
  }

  function replay() {
    setLevelIndex(0);
    reset();
    window.scrollTo(0, 0);
  }

  if (complete && result === 'lit') return <section className="logic-finale" role="status">
    <div className="logic-finale-card">
      <span className="eyebrow">خلصت المراحل الثلاث ✨</span>
      <img src="/logo.png" alt="شعار CSE Arcade مضوي"/>
      <h1>النادي نوررر بوجودك !</h1>
      <div className="logic-finale-actions">
        <button className="primary" onClick={onHome}>التوجه للرئيسية</button>
        <button className="secondary" onClick={replay}>العب مرة أخرى</button>
      </div>
    </div>
  </section>;

  const lastStage = picks.length - 1;
  const lastGate = lastStage >= 0 ? level.paths[lastStage][picks[lastStage]] : null;
  const previousSignal = lastStage >= 0 ? signalAt(level, picks.slice(0, -1)) : null;

  return <section className="logic-page">
    <button className="back" onClick={onHome}><span aria-hidden="true">→</span> ارجع للألعاب</button>
    <div className="logic-heading"><div><span className="eyebrow">بوابات المنطق</span><h1 ref={title} tabIndex="-1">خلّي الشعار يضوي<span>!</span></h1><p>اختار ممر عند كل مفترق. بدنا الإشارة توصل للشعار وقيمتها <b>1</b>.</p></div><span className="logic-level">المرحلة {levelIndex + 1} / {LOGIC_LEVELS.length}</span></div>
    <div className={`logic-maze ${compact ? 'compact' : ''}`}>
      <svg className="maze-lines" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="maze-arrow" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#45b7c9"/></marker><marker id="maze-arrow-lit" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#17b985"/></marker><marker id="maze-arrow-fail" markerWidth="9" markerHeight="9" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#dc7a6c"/></marker></defs>
        {mazeEdges(map, picks, compact).map((edge, index) => <path key={index} d={edge.path} className={`maze-route ${edge.state} ${result === 'dark' && edge.state === 'traced' ? 'failed' : ''}`} markerMid={edge.state === 'muted' ? undefined : `url(#${edge.state === 'traced' ? result === 'dark' ? 'maze-arrow-fail' : 'maze-arrow-lit' : 'maze-arrow'})`}/>)}
      </svg>
      <div className="maze-source" style={position(map.source, width, height)}><span>البداية</span><strong>{level.start}</strong></div>
      {level.paths.map((options, stage) => options.map((gate, option) => {
        const chosen = picks[stage] === option;
        const before = signalAt(level, picks.slice(0, stage));
        return <button key={`${stage}-${option}`} className={`maze-gate ${chosen ? 'selected' : ''} ${stage === picks.length && !result ? 'available' : ''}`} style={position(map.stages[stage][option], width, height)} disabled={stage !== picks.length || Boolean(result)} onClick={() => choose(stage, option)} aria-label={`مفترق ${stage + 1}: ممر ${gate[0]}${gate[0] === 'NOT' ? '' : ` مع ${gate[1]}`}`}><strong dir="ltr">{gateLabel(gate)}</strong><small dir="ltr">{chosen ? `${before} → ${gateOutput(before, gate)}` : `ممر ${stage + 1}`}</small></button>;
      }))}
      <div className={`maze-destination ${result === 'lit' ? 'lit' : ''}`} style={position(map.finish, width, height)}><span>النهاية</span><img src="/logo.png" alt="شعار CSE Arcade"/><small>{result === 'lit' ? 'ضاوي!' : 'مطفّي'}</small></div>
    </div>
    <div className="logic-status" role="status" aria-live="polite">
      {lastGate && <p>آخر بوابة: <b dir="ltr">{lastGate[0] === 'NOT' ? `NOT ${previousSignal} = ${signal}` : `${previousSignal} ${lastGate[0]} ${lastGate[1]} = ${signal}`}</b></p>}
      {!result && <p>الإشارة هسا <strong>{signal}</strong> · {picks.length === level.paths.length ? 'وصلت للنهاية' : 'اختار الممر الجاي'}</p>}
      {result === 'dark' && <><h2>الإشارة وصلت 0... والشعار لسه نايم 😴</h2><button className="primary" onClick={reset}>جرّب مسار ثاني</button></>}
      {result === 'lit' && <><h2>هيك الشغل! وصلت 1 والشعار ضاوي ✨</h2><button className="primary" onClick={next}>المرحلة اللي بعدها</button></>}
    </div>
  </section>;
}

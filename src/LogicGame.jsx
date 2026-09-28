import React, { useRef, useState } from 'react';
import { gateOutput, LOGIC_LEVELS, signalAt } from './logic-gates';

function gateLabel([gate, other]) {
  return gate === 'NOT' ? 'NOT' : `${gate} · ${other}`;
}

export default function LogicGame({ onHome }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [picks, setPicks] = useState([]);
  const [result, setResult] = useState(null);
  const title = useRef(null);
  const level = LOGIC_LEVELS[levelIndex];
  const signal = signalAt(level, picks);
  const complete = levelIndex === LOGIC_LEVELS.length - 1;

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
    if (!complete) setLevelIndex(levelIndex + 1);
    else setLevelIndex(0);
    reset();
    title.current?.focus();
  }

  const lastStage = picks.length - 1;
  const lastGate = lastStage >= 0 ? level.paths[lastStage][picks[lastStage]] : null;
  const previousSignal = lastStage >= 0 ? signalAt(level, picks.slice(0, -1)) : null;

  return <section className="logic-page">
    <button className="back" onClick={onHome}><span aria-hidden="true">→</span> ارجع للألعاب</button>
    <div className="logic-heading"><div><span className="eyebrow">بوابات المنطق</span><h1 ref={title} tabIndex="-1">خلّي الشعار يضوي<span>!</span></h1><p>اختار ممر عند كل مفترق. بدنا الإشارة توصل للشعار وقيمتها <b>1</b>.</p></div><span className="logic-level">المرحلة {levelIndex + 1} / {LOGIC_LEVELS.length}</span></div>
    <div className="logic-board">
      <div className="logic-endpoint logic-source"><span>الإشارة الداخلة</span><strong>{level.start}</strong><small>من هون بتبلّش</small></div>
      {level.paths.map((options, stage) => {
        const chosen = picks[stage];
        const before = signalAt(level, picks.slice(0, stage));
        return <div className={`logic-stage ${stage === picks.length && !result ? 'active' : ''}`} key={`${levelIndex}-${stage}`}>
          <span className="logic-stage-label">مفترق {stage + 1}</span>
          <div className="logic-options">{options.map((gate, option) => <button key={option} className={`logic-gate ${chosen === option ? 'selected' : ''}`} disabled={stage !== picks.length || Boolean(result)} onClick={() => choose(stage, option)} aria-label={`ممر ${gate[0]}${gate[0] === 'NOT' ? '' : ` مع ${gate[1]}`}`}><strong dir="ltr">{gateLabel(gate)}</strong><span dir={chosen === option ? 'ltr' : undefined}>{chosen === option ? `${before} → ${gateOutput(before, gate)}` : 'اختار هالممر'}</span></button>)}</div>
        </div>;
      })}
      <div className={`logic-endpoint logic-logo ${result === 'lit' ? 'lit' : ''}`}><span>نهاية الإشارة</span><img src="/logo.png" alt="شعار CSE Arcade"/><strong>{result === 'lit' ? 'الشعار ضاوي!' : 'الشعار مطفّي'}</strong></div>
    </div>
    <div className="logic-status" role="status" aria-live="polite">
      {lastGate && <p>آخر بوابة: <b dir="ltr">{lastGate[0] === 'NOT' ? `NOT ${previousSignal} = ${signal}` : `${previousSignal} ${lastGate[0]} ${lastGate[1]} = ${signal}`}</b></p>}
      {!result && <p>الإشارة هسا <strong>{signal}</strong> · {picks.length === level.paths.length ? 'وصلت للنهاية' : 'اختار الممر الجاي'}</p>}
      {result === 'dark' && <><h2>الإشارة وصلت 0... والشعار لسه نايم 😴</h2><button className="primary" onClick={reset}>جرّب مسار ثاني</button></>}
      {result === 'lit' && <><h2>{complete ? 'أسطورة! ضوّيت الشعار بكل المراحل ✨' : 'هيك الشغل! وصلت 1 والشعار ضاوي ✨'}</h2><button className="primary" onClick={next}>{complete ? 'العب من أول وجديد' : 'المرحلة اللي بعدها'}</button></>}
    </div>
  </section>;
}

import React, { useEffect, useRef, useState } from 'react';
import { STEPS, shuffledSteps, placeStep, isCorrectSequence } from './sequence';

const colors = ['blue', 'violet', 'mint', 'orange', 'pink', 'cyan', 'gold'];
const colorFor = step => colors[STEPS.indexOf(step)];

export default function SequenceGame({ onHome }) {
  const [bank, setBank] = useState(shuffledSteps);
  const [slots, setSlots] = useState(() => Array(7).fill(null));
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null);
  const [hover, setHover] = useState(null);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState('');
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  const title = useRef(null);
  const filled = slots.filter(Boolean).length;

  useEffect(() => { title.current?.focus(); }, [result]);
  useEffect(() => {
    if (!drag) return;
    let frame;
    const scroll = () => {
      const p = pointer.current;
      if (p?.moving) {
        const delta = p.y < 70 ? -12 : p.y > window.innerHeight - 70 ? 12 : 0;
        if (delta) window.scrollBy(0, delta);
      }
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [Boolean(drag)]);

  function place(step, index) {
    setSlots(current => placeStep(current, step, index));
    setSelected(null);
    setNotice(`حطّينا ${step} في الخطوة ${index + 1}.`);
  }
  function remove(step) {
    setSlots(current => current.map(item => item === step ? null : item));
    setSelected(null);
    setNotice('رجّعنا البطاقة للطاولة. جرّب مكان ثاني.');
  }
  function choose(step) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setSelected(current => current === step ? null : step);
    setNotice(`اخترت ${step}. اضغط على المكان اللي بدّك تحطّها فيه.`);
  }
  function down(e, step) {
    if (e.button !== 0) return;
    suppressClick.current = false;
    pointer.current = { step, startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, moving: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e) {
    const p = pointer.current;
    if (!p) return;
    p.x = e.clientX; p.y = e.clientY;
    if (!p.moving && Math.hypot(p.x - p.startX, p.y - p.startY) < 7) return;
    p.moving = true;
    setDrag({ step: p.step, x: p.x, y: p.y });
    const target = document.elementFromPoint(p.x, p.y)?.closest('[data-drop]');
    setHover(target?.dataset.drop ?? null);
  }
  function up(e) {
    const p = pointer.current;
    if (p?.moving) {
      suppressClick.current = true;
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop]')?.dataset.drop;
      if (target === 'bank') remove(p.step);
      else if (target !== undefined) place(p.step, Number(target));
    }
    pointer.current = null;
    setDrag(null); setHover(null);
  }
  function cancel() { pointer.current = null; setDrag(null); setHover(null); }
  function reset() {
    setSlots(Array(7).fill(null)); setBank(shuffledSteps()); setSelected(null);
    setResult(null); setNotice('جولة جديدة، وفرصة جديدة لعبادة!');
  }
  function card(step, inSlot = false) {
    return <button key={step} className={`sequence-chip chip-${colorFor(step)} ${selected === step ? 'picked' : ''} ${drag?.step === step ? 'dragging' : ''}`}
      aria-label={`${inSlot ? 'نقل' : 'اختيار'} ${step}`} aria-pressed={selected === step}
      onClick={() => {
        if (suppressClick.current) { suppressClick.current = false; return; }
        if (inSlot && selected && selected !== step) place(selected, slots.indexOf(step));
        else choose(step);
      }} onPointerDown={e => down(e, step)} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}
      onKeyDown={e => { if (e.key === 'Escape') { setSelected(null); cancel(); } }}>
      <span className="grip" aria-hidden="true">⠿</span><bdi dir="ltr">{step}</bdi><span className="chip-dot" aria-hidden="true"/>
    </button>;
  }

  if (result !== null) return <section className={`sequence-result ${result ? 'sequence-won' : 'sequence-lost'}`}>
    <span className="eyebrow">{result ? 'البوابة فتحت… تنفّس يا عبادة!' : 'البوابة لسه معلّقة… يا ساتر'}</span>
    <div className="reaction-frame"><img src={`/obada/${result ? 'success' : 'crying'}.png`} alt={result ? 'عبادة فرحان وعيونه بتلمع' : 'عبادة ببكي لأن الشعب سكّرت'}/></div>
    <h1 ref={title} tabIndex="-1">{result ? 'عااااش يا هندسة !' : 'سكرن الشعب, حسبي الله'}</h1>
    <p>{result ? 'رتّبتها صح! عبادة دخل البوابة ولحق يسجّل مواده. أنقذت الفصل يا بطل.' : 'خطوة راحت قبل أختها، والبوابة ما اشتغلت. معلش يا عبادة… منجرّب كمان مرة.'}</p>
    <div className="sequence-result-actions"><button className="primary" onClick={onHome}>ارجع للرئيسية</button><button className="secondary" onClick={reset}>جولة ثانية</button></div>
  </section>;

  return <section className="sequence-page">
    <button className="back" onClick={onHome}>→ ارجع للألعاب</button>
    <div className="sequence-heading"><div><span className="eyebrow">مهمّة إنقاذ التسجيل</span><h1 ref={title} tabIndex="-1">ساعد <em>عبادة!</em></h1><p>البوابة معلّقة، وعبادة مستنّيك. رتّب خطوات تشغيل النظام من فوق لتحت، وبعدين جرّب تفتحها.</p></div><span className="portal-status"><i/> البوابة مشغولة</span></div>
    <div className="sequence-workspace">
      <aside className="obada-companion"><div className="speech-bubble">يا رب تزبط, بدي اسجل قبل ما تسكر الشعب.</div><img src="/obada/begging.png" alt="عبادة بترجّى إن البوابة تفتح" draggable="false"/><span className="companion-caption">عبادة · طالب على أعصابه</span></aside>
      <section className={`sequence-bank ${hover === 'bank' ? 'drop-hover' : ''}`} data-drop="bank" aria-label="بطاقات الخطوات المبعثرة">
        <div className="board-heading"><h2>الخطوات مخربطة</h2><span>اسحبها من هون</span></div>
        <p className="board-help" id="drag-help">اسحب البطاقة لمكانها، أو اختارها واضغط على خانة. وبتقدر تبدّل بطاقتين.</p>
        <div className="scattered-cards" aria-describedby="drag-help">{bank.filter(step => !slots.includes(step)).map(step => card(step))}</div>
        {filled === 7 && <div className="empty-bank"><span>✦</span><strong>كل القطع بمكانها!</strong><p>بقي نشوف إذا البوابة بتوافق.</p></div>}
        <span className="bank-footnote">الترتيب بإيدك… ومصير شعبة الساعة ١٠ كمان.</span>
      </section>
      <section className="sequence-board" aria-label="ترتيب تشغيل النظام">
        <div className="board-heading"><h2>خطّة الإنقاذ</h2><span>{filled} / 7 خطوات</span></div>
        <ol className="sequence-slots">{slots.map((step, i) => <li key={i} className={`sequence-slot ${step ? 'occupied' : ''} ${hover === String(i) ? 'drop-hover' : ''}`} data-drop={i}>
          <span className="slot-number">{i + 1}</span>
          {step ? <><div className="slot-card">{card(step, true)}</div><button className="remove-step" aria-label={`إرجاع ${step} للطاولة`} onClick={() => remove(step)}>×</button></> : <button className="empty-slot" aria-label={`الخانة ${i + 1}`} onClick={() => { if (selected) place(selected, i); else setNotice('اختار بطاقة من الطاولة بالأول.'); }}><span>{selected ? 'حطّ البطاقة هون' : i === 0 ? 'شو أول إشي بنعمله؟' : 'اسحب خطوة لهون'}</span><span aria-hidden="true">＋</span></button>}
        </li>)}</ol>
        <button className="primary open-portal" disabled={filled !== 7} onClick={() => setResult(isCorrectSequence(slots))}>افتح البوابة يا رب <span aria-hidden="true">↗</span></button>
        <p className="submit-note">{filled === 7 ? 'راجع الترتيب… عبادة معتمد عليك.' : 'كمّل الخانات السبعة عشان نجرّب نفتح البوابة.'}</p>
      </section>
    </div>
    <p className="sequence-notice" role="status" aria-live="polite">{notice || 'معلومة تطمّنك: ما في مؤقّت. رتّب على راحتك.'}</p>
    {drag && <div className={`sequence-chip drag-ghost chip-${colorFor(drag.step)}`} style={{ left: drag.x, top: drag.y }} aria-hidden="true"><bdi dir="ltr">{drag.step}</bdi></div>}
  </section>;
}

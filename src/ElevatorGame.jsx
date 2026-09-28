import React, { useEffect, useRef, useState } from 'react';
import { createChallenges, ELEVATOR_FLOORS, ELEVATOR_SECONDS, isCorrectAnswer, toBinary } from './elevator';

const wrongMessages = ['فضحتنا!', 'هذا مهندس؟؟', 'شكله هالحدا رح يتسجّل غياب', 'حاب تقعد عالأرض؟'];
const timeoutMessages = [
  'مبروك انت وصلت',
  'وصلت مكتب رئيس القسم ترجاه يقيم الغياب 😂',
  'بدري',
  'اذا بدك تفوت اسحب كرسي معك راحت عليك',
];
const randomMessage = messages => messages[Math.floor(Math.random() * messages.length)];

export default function ElevatorGame({ onHome }) {
  const [challenges, setChallenges] = useState(createChallenges);
  const [floor, setFloor] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(ELEVATOR_SECONDS * 1000);
  const [phase, setPhase] = useState('playing');
  const [feedback, setFeedback] = useState(null);
  const [run, setRun] = useState(0);
  const deadline = useRef(Date.now() + ELEVATOR_SECONDS * 1000);
  const floorRef = useRef(0);
  const phaseRef = useRef('playing');
  const input = useRef(null);
  const title = useRef(null);
  const current = challenges[floor];
  const seconds = Math.ceil(timeLeft / 1000);

  useEffect(() => { title.current?.focus(); }, []);
  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = () => {
      const remaining = Math.max(0, deadline.current - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0 && phaseRef.current === 'playing') {
        phaseRef.current = 'lost';
        setPhase('lost');
        setFeedback({ kind: 'lost', text: randomMessage(timeoutMessages) });
      }
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [phase, run]);

  function submit(event) {
    event.preventDefault();
    if (phaseRef.current !== 'playing') return;
    if (Date.now() >= deadline.current) {
      phaseRef.current = 'lost';
      setTimeLeft(0);
      setPhase('lost');
      setFeedback({ kind: 'lost', text: randomMessage(timeoutMessages) });
      return;
    }
    if (!isCorrectAnswer(challenges[floorRef.current], answer)) {
      setFeedback({ kind: 'wrong', text: randomMessage(wrongMessages) });
      input.current?.select();
      return;
    }
    const nextFloor = floorRef.current + 1;
    floorRef.current = nextFloor;
    setFloor(nextFloor);
    setAnswer('');
    if (nextFloor === ELEVATOR_FLOORS) {
      phaseRef.current = 'won';
      setPhase('won');
      setFeedback(null);
    } else {
      setFeedback({ kind: 'right', text: `تمام! وصلت الطابق ${nextFloor}. يلا عاللي بعده.` });
      input.current?.focus();
    }
  }

  function restart() {
    floorRef.current = 0;
    phaseRef.current = 'playing';
    deadline.current = Date.now() + ELEVATOR_SECONDS * 1000;
    setChallenges(createChallenges());
    setFloor(0);
    setAnswer('');
    setTimeLeft(ELEVATOR_SECONDS * 1000);
    setFeedback(null);
    setPhase('playing');
    setRun(value => value + 1);
    requestAnimationFrame(() => input.current?.focus());
  }

  const isBinary = current?.answerType === 'binary';
  const question = isBinary
    ? `حوّل ${current?.value} من عشري إلى ثنائي من ٤ خانات`
    : `حوّل ${current ? toBinary(current.value) : ''} من ثنائي إلى عشري`;

  return <section className="elevator-page">
    <button className="back" onClick={onHome}><span aria-hidden="true">→</span> ارجع للألعاب</button>
    <div className="elevator-heading">
      <div><span className="eyebrow">المصعد الثنائي</span><h1 ref={title} tabIndex="-1">الطابق الخامس مستنّيك<span>!</span></h1><p>المختبر بالطابق ٥. حلّ خمس تحويلات بين الثنائي والعشري، ووصل قبل ما يخلص الوقت.</p></div>
      <div className={`elevator-timer ${seconds <= 5 && phase === 'playing' ? 'urgent' : ''}`} role="timer" aria-label={`الوقت المتبقي ${seconds} ثانية`}><strong dir="ltr">00:{String(seconds).padStart(2, '0')}</strong><span>ثانية</span></div>
    </div>
    <div className="elevator-time-track"><span style={{ width: `${timeLeft / (ELEVATOR_SECONDS * 1000) * 100}%` }}/></div>

    <div className="elevator-layout">
      <figure className="elevator-scene">
        <img src={phase === 'lost' ? '/elevator/closed.jpg' : '/elevator/open.jpg'} alt={phase === 'lost' ? 'المصعد مغلق بعد انتهاء الوقت' : 'المصعد مفتوح من الواجهة الأمامية'} />
        <div className={`elevator-floor-number ${phase === 'lost' ? 'stopped' : ''}`} aria-label={`الطابق الحالي ${floor}`}><span aria-hidden="true">{phase === 'lost' ? '↓' : '↑'}</span> {floor}</div>
        {phase !== 'lost' && <div className="elevator-cabin-display" aria-hidden="true" dir="ltr">{phase === 'won' ? 'DONE' : (answer || (isBinary ? '____' : '__'))}</div>}
      </figure>

      <div className="elevator-control">
        {phase === 'playing' ? <>
          <div className="elevator-progress"><span>الطابق الحالي <b>{floor}</b> / ٥</span><span>المختبر: الطابق ٥</span></div>
          <div className="elevator-dots" aria-label={`${floor} من ٥ طوابق`}>{Array.from({ length: ELEVATOR_FLOORS }, (_, index) => <span key={index} className={index < floor ? 'reached' : ''}/>)}</div>
          <span className="elevator-question-type">{isBinary ? 'عشري ← ثنائي' : 'ثنائي ← عشري'}</span>
          <h2>{question}</h2>
          <p className="elevator-hint">{isBinary ? 'مثال سريع: ٥ بتصير 0101' : 'مثال سريع: 0101 بتساوي ٥'}</p>
          <form onSubmit={submit} className="elevator-answer-form">
            <label htmlFor="elevator-answer">اكتب الجواب على شاشة المصعد</label>
            <div className="elevator-answer-row"><input ref={input} id="elevator-answer" dir="ltr" type="text" inputMode="numeric" autoComplete="off" spellCheck="false" maxLength={isBinary ? 4 : 2} value={answer} onChange={event => { setAnswer(event.target.value.replace(isBinary ? /[^01]/g : /\D/g, '')); setFeedback(null); }} placeholder={isBinary ? '0000' : '0–15'} aria-describedby="elevator-answer-help"/><button className="primary" type="submit" disabled={!answer}>اطلع ↑</button></div>
            <small id="elevator-answer-help">{isBinary ? 'اكتب ٤ خانات من 0 و1.' : 'اكتب رقمًا بين 0 و15.'}</small>
          </form>
          <p className={`elevator-feedback ${feedback?.kind || ''}`} role="status" aria-live="polite">{feedback?.text || 'كل جواب صح بطلعك طابق واحد.'}</p>
        </> : <div className={`elevator-result ${phase}`} role="status" aria-live="polite">
          <span className="elevator-result-icon" aria-hidden="true">{phase === 'won' ? '✓' : '⌛'}</span>
          <h2>{phase === 'won' ? 'أحسنت! وصلت المختبر في الوقت' : 'خلص الوقت!'}</h2>
          <p>{phase === 'won' ? 'لحقت تحجز كرسي بدل ما تقعد على الطاولة 😂' : feedback?.text}</p>
          <div className="elevator-result-actions"><button className="primary" onClick={restart}>جرّب مرة ثانية</button><button className="secondary" onClick={onHome}>ارجع للرئيسية</button></div>
        </div>}
      </div>
    </div>
  </section>;
}

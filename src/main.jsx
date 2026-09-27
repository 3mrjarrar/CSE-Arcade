import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createRound } from './questions';
import SequenceGame from './SequenceGame';
import './styles.css';
import './theme.css';
import './arabic.css';
import './sequence.css';

const years = ['البدايات الحلوة', 'الأساس صار أقوى', 'أنظمة وشبكات', 'أنظمة مدمجة ووقت حقيقي', 'هندسة على مستوى أكبر'];
const levels = ['beginner', 'intermediate', 'advanced'];
const levelNames = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' };
const letters = ['أ', 'ب', 'ج', 'د'];

function Icon({ type = 'arrow', ...props }) {
  const paths = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    bolt: 'm13 2-9 12h7l-1 8 10-13h-7l1-7',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    check: 'm5 12 4 4L19 6',
    home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3z',
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[type]} /></svg>;
}

function App() {
  const [screen, setScreen] = useState('home');
  const [year, setYear] = useState(1);
  const [level, setLevel] = useState('beginner');
  const [round, setRound] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState(false);
  const dialog = useRef(null);
  const heading = useRef(null);
  const index = answers.length;
  const score = answers.filter((answer, i) => answer === round[i]?.correct).length;

  useEffect(() => {
    if (screen === 'result') dialog.current?.showModal();
    else heading.current?.focus();
  }, [screen]);

  function home() { setScreen('home'); setReview(false); }
  function start() {
    setRound(createRound(year, level));
    setAnswers([]);
    setSelected(null);
    setReview(false);
    setScreen('quiz');
  }
  function next() {
    if (selected === null) return;
    setAnswers([...answers, selected]);
    setSelected(null);
    if (index === 4) setScreen('result');
    else requestAnimationFrame(() => heading.current?.focus());
  }

  const active = screen === 'quiz' || screen === 'result';
  return <div className="app-shell">
    <header className="header">
      <button className="brand" onClick={home} aria-label="الصفحة الرئيسية لأركيد CSE">
        <img src="/logo.png" alt=""/><span>أركيد <span className="brand-light" dir="ltr">CSE</span></span>
      </button>
      <nav aria-label="التنقل الرئيسي">
        <button className={screen === 'home' ? 'nav-active' : ''} onClick={home}><Icon type="grid"/>الألعاب</button>
        <span className="status"><i/> جاهز تلعب؟</span>
      </nav>
    </header>

    <main>
      {screen === 'home' ? <>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="tiny-line"/> شوية لعب، وكثير اكتشاف</span>
            <h1 ref={heading} tabIndex="-1">مستواك الجاي<br/>بيبدأ <em>من هون.</em></h1>
            <p>بين المحاضرات والكود والقهوة، في مكان نلعب فيه ونتعلّم سوا. جرّب معلوماتك، ويمكن تفاجئ حالك!</p>
            <a className="primary" href="#games">شوف التحدّي <Icon/></a>
            <div className="hero-notes"><span><Icon type="bolt"/> جولات خفيفة</span><span><Icon type="code"/> لعقول هندسة الحاسوب</span></div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <span className="art-code code-one">&lt;/&gt;</span><span className="art-code code-two">01</span><span className="art-plus">+</span>
            <img src="/logo.png" alt="شعار أركيد CSE بتنين وأذرع ألعاب"/>
            <span className="art-label"><i/> يلا للمستوى الجاي</span>
          </div>
        </section>

        <section id="games" className="games">
          <div className="section-heading"><div><span className="eyebrow">اختار تحدّيك</span><h2>زاوية الألعاب<span>.</span></h2></div><span className="game-count">لعبتين وجاهزين إلك</span></div>
          <button className="game-card" onClick={() => setScreen('year')}>
            <div className="game-art"><div className="question-tile">؟<span>_</span></div><span className="mini-code">جاهز؟ يلا نلعب!</span><span className="art-corner">لعبة 01 / CSE</span></div>
            <div className="game-info"><span className="tag"><i/> تحدّي معلومات</span><h3>لعبة الأسئلة</h3><p>خمسة أسئلة على قدّ مستواك.<br/>جاوب، جرّب، وتذكّر: الغلطة كمان بتعلّم.</p><div className="game-meta"><span>٥ أسئلة</span><span>٥ سنوات</span><span>٣ مستويات</span></div><span className="play-link">يلا نبدأ <Icon/></span></div>
            <span className="card-number">01</span>
          </button>
          <button className="game-card sequence-cover-card" onClick={() => setScreen('sequence')}>
            <div className="game-art sequence-cover"><img src="/obada/cover.png" alt="عبادة محتار قدّام شاشة البوابة المعطّلة" loading="lazy"/></div>
            <div className="game-info"><span className="tag"><i/> ترتيب وتسليك أمور</span><h3>لحّق عبادة يسجّل!</h3><p>البوابة معلّقة، والشُّعب ما بتستنّى.<br/>رتّب خطوات تشغيل النظام وأنقذ تسجيل عبادة.</p><div className="game-meta"><span>٧ خطوات</span><span>سحب وإفلات</span><span>عبادة معتمد عليك</span></div><span className="play-link">أنا قدّها <Icon/></span></div><span className="card-number">02</span>
          </button>
          <div className="coming-soon"><span className="plus-box">+</span><div><strong>وفي ألعاب ثانية بالطريق.</strong><p>لسّه الأركيد بأول الطريق، زيّنا كلنا.</p></div><span className="outline-tag">خلّيك فضولي</span></div>
        </section>
      </> : screen === 'sequence' ? <SequenceGame onHome={home}/> : <section className="play-area">
        <button className="back" onClick={() => screen === 'level' ? setScreen('year') : home()}><span aria-hidden="true">→</span> {screen === 'level' ? 'غيّر السنة' : 'ارجع للألعاب'}</button>
        <div className="play-topline"><span className="eyebrow">لعبة الأسئلة</span><span className="round-badge">{active ? `السنة ${year} / ${levelNames[level]}` : 'جهّز تحدّيك'}</span></div>

        {screen === 'year' && <>
          <h1 ref={heading} tabIndex="-1" className="screen-title">بأي سنة إنت<span>؟</span></h1>
          <p className="subtitle">اختار سنتك الدراسية، والأسئلة بتكون على مقاسك.</p>
          <div className="year-grid">{years.map((name, i) => <button key={name} className={`year-card ${year === i + 1 ? 'chosen' : ''}`} onClick={() => setYear(i + 1)} aria-pressed={year === i + 1}><span className="year-digit">0{i + 1}</span><strong>السنة {i + 1}</strong><span>{name}</span><span className="selection-dot">{year === i + 1 && <Icon type="check" width="14" height="14"/>}</span></button>)}</div>
          <div className="step-footer"><span>الخطوة ١ <span className="muted">من ٢</span></span><button className="primary" onClick={() => setScreen('level')}>اختار المستوى <Icon/></button></div>
        </>}

        {screen === 'level' && <>
          <h1 ref={heading} tabIndex="-1" className="screen-title">قدّيش بدّك تتحدّى حالك<span>؟</span></h1>
          <p className="subtitle">السنة {year} · {years[year - 1]}. ولا يهمك، كل مستوى إله متعته.</p>
          <div className="level-grid">{levels.map((name, i) => <button key={name} className={`level-card ${level === name ? 'chosen' : ''}`} onClick={() => setLevel(name)} aria-pressed={level === name}><div className="bars">{[0, 1, 2].map(n => <i key={n} className={n <= i ? 'lit' : ''}/>)}</div><h2>{levelNames[name]}</h2><p>{['نبلّش من الأساسيات، خطوة بخطوة.', 'عارف الأساس؟ خلّينا نوصل الأفكار ببعض.', 'جاهز للأسئلة اللي بدها تركيز زيادة؟'][i]}</p><span className="selection-dot">{level === name && <Icon type="check" width="14" height="14"/>}</span></button>)}</div>
          <div className="step-footer"><span>الخطوة ٢ <span className="muted">من ٢ · ٥ أسئلة · بدون مؤقّت</span></span><button className="primary" onClick={start}>يلا نلعب <Icon type="bolt"/></button></div>
        </>}

        {active && <>
          <div className="quiz-progress"><span>السؤال {Math.min(index + 1, 5)} من ٥</span><div>{[0, 1, 2, 3, 4].map(i => <i key={i} className={i <= index ? 'filled' : ''}/>)}</div></div>
          {screen === 'quiz' && <div className="question-panel"><h1 className="question-title" ref={heading} tabIndex="-1">{round[index].prompt}</h1><div className="options" role="group" aria-label="اختيارات الإجابة">{round[index].options.map((option, i) => <button key={`${index}-${option}`} className={`option ${selected === option ? 'chosen' : ''}`} onClick={() => setSelected(option)} aria-pressed={selected === option}><span>{letters[i]}</span><span>{option}</span><span className="option-check">{selected === option && <Icon type="check"/>}</span></button>)}</div><div className="question-footer"><span>اختار جواب واحد. وخذ راحتك، ما في مؤقّت.</span><button className="primary" disabled={selected === null} onClick={next}>{index === 4 ? 'شوف نتيجتك' : 'السؤال اللي بعده'}<Icon/></button></div></div>}
        </>}
      </section>}
    </main>

    <footer><span>أركيد CSE <span className="footer-separator">/</span> العب. تعلّم. وكمّل.</span><span>للمهندسين اللي لسه بيبنوا طريقهم، سؤال ورا سؤال.</span></footer>

    {screen === 'result' && <dialog ref={dialog} className="result-dialog" onCancel={e => { e.preventDefault(); home(); }}>
      <span className="eyebrow">خلصت الجولة!</span>
      <div className="score-ring"><strong>{score}<span>/ 5</span></strong><span>{score * 20}% إجابات صح</span></div>
      <h2>{score === 5 ? 'يا سلام! جبتها كاملة.' : score >= 3 ? 'حلوة منك! كمّل هيك.' : 'ولا يهمك، كل سؤال بعلّم.'}</h2>
      <p>السنة {year} · {levelNames[level]}<br/>{score === 5 ? 'واضح إنك مركز! جاهز لتحدّي ثاني؟' : 'المهم إنك جرّبت. الجولة الجاية بتكون أحلى.'}</p>
      <button className="review-toggle" onClick={() => setReview(!review)} aria-expanded={review}>{review ? 'خبّي الإجابات' : 'راجع إجاباتك'} {review ? '−' : '+'}</button>
      {review && <div className="answer-review">{round.map((q, i) => <div key={q.prompt}><strong><span className={answers[i] === q.correct ? 'correct' : 'incorrect'}>{answers[i] === q.correct ? '✓' : '✕'}</span> {i + 1}. {q.prompt}</strong><p>جوابك: {answers[i]}</p>{answers[i] !== q.correct && <p className="correct">الجواب الصح: {q.correct}</p>}</div>)}</div>}
      <div className="result-actions"><button className="primary" onClick={home}><Icon type="home"/>ارجع للرئيسية</button><button className="secondary" onClick={start}>جرّب مرة ثانية</button></div>
    </dialog>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

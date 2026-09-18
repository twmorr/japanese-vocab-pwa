const { useState, useEffect, useMemo, useCallback } = React;

// ---------- Default vocab (from lesson notes) ----------
const DEFAULT_VOCAB = [
  {"id":"1","word":"食べる","reading":"たべる","meaning":"to eat","type":"verb","group":"ichidan","difficulty":1,"level":0},
  {"id":"2","word":"する","reading":"する","meaning":"to do","type":"verb","group":"irregular","difficulty":1,"level":0},
  {"id":"3","word":"行く","reading":"いく","meaning":"to go","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"4","word":"見る","reading":"みる","meaning":"to watch/see","type":"verb","group":"ichidan","difficulty":1,"level":0},
  {"id":"5","word":"会う","reading":"あう","meaning":"to meet/see (someone)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"6","word":"話す","reading":"はなす","meaning":"to talk","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"7","word":"読む","reading":"よむ","meaning":"to read","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"8","word":"聞く","reading":"きく","meaning":"to listen/ask/hear","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"9","word":"飲む","reading":"のむ","meaning":"to drink","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"10","word":"作る","reading":"つくる","meaning":"to make/cook","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"11","word":"知る","reading":"しる","meaning":"to know","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"12","word":"住む","reading":"すむ","meaning":"to live (reside)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"13","word":"買う","reading":"かう","meaning":"to buy","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"14","word":"取る","reading":"とる","meaning":"to take/get","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"15","word":"忘れる","reading":"わすれる","meaning":"to forget","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"16","word":"辛い","reading":"からい","meaning":"spicy","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"17","word":"うるさい","reading":"うるさい","meaning":"loud/noisy","type":"adjective (い)","group":"","difficulty":2,"level":0},
  {"id":"18","word":"違う","reading":"ちがう","meaning":"to be different/differ","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"19","word":"好きな","reading":"すきな","meaning":"favorite/like","type":"adjective (な)","group":"","difficulty":1,"level":0},
  {"id":"20","word":"嫌いな","reading":"きらいな","meaning":"least favorite/dislike","type":"adjective (な)","group":"","difficulty":2,"level":0},
  {"id":"21","word":"美しい","reading":"うつくしい","meaning":"beautiful","type":"adjective (い)","group":"","difficulty":3,"level":0},
  {"id":"22","word":"安い","reading":"やすい","meaning":"cheap","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"23","word":"美味しい","reading":"おいしい","meaning":"delicious","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"24","word":"天気","reading":"てんき","meaning":"weather","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"25","word":"曇り","reading":"くもり","meaning":"cloudy","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"26","word":"悪い","reading":"わるい","meaning":"bad","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"27","word":"雨","reading":"あめ","meaning":"rain","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"28","word":"雨が降る","reading":"あめがふる","meaning":"to rain","type":"expression","group":"","difficulty":2,"level":0},
  {"id":"29","word":"ある","reading":"ある","meaning":"to have/there is (non-living)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"30","word":"いる","reading":"いる","meaning":"to have/there is (living)","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"31","word":"厳しい","reading":"きびしい","meaning":"strict","type":"adjective (い)","group":"","difficulty":3,"level":0},
  {"id":"32","word":"訪れる","reading":"おとずれる","meaning":"to visit","type":"verb","group":"ichidan","difficulty":3,"level":0},
  {"id":"33","word":"宗教","reading":"しゅうきょう","meaning":"religion","type":"noun","group":"","difficulty":3,"level":0},
  {"id":"34","word":"教会","reading":"きょうかい","meaning":"church","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"35","word":"運転する","reading":"うんてんする","meaning":"to drive","type":"verb","group":"irregular","difficulty":2,"level":0},
  {"id":"36","word":"練習する","reading":"れんしゅうする","meaning":"to practice","type":"verb","group":"irregular","difficulty":2,"level":0},
  {"id":"37","word":"以上","reading":"いじょう","meaning":"more than","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"38","word":"以下","reading":"いか","meaning":"less than","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"39","word":"古い","reading":"ふるい","meaning":"old","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"40","word":"写真","reading":"しゃしん","meaning":"photo","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"41","word":"風","reading":"かぜ","meaning":"wind","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"42","word":"だから","reading":"だから","meaning":"so/therefore","type":"conjunction","group":"","difficulty":1,"level":0},
  {"id":"43","word":"けど","reading":"けど","meaning":"but (casual)","type":"conjunction","group":"","difficulty":1,"level":0},
  {"id":"44","word":"慣れる","reading":"なれる","meaning":"to get used to","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"45","word":"家具","reading":"かぐ","meaning":"furniture","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"46","word":"すぎる","reading":"すぎる","meaning":"too much (suffix)","type":"suffix","group":"","difficulty":2,"level":0},
  {"id":"47","word":"味","reading":"あじ","meaning":"taste/flavor","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"48","word":"不健康","reading":"ふけんこう","meaning":"unhealthy","type":"adjective (な)","group":"","difficulty":2,"level":0},
  {"id":"49","word":"変","reading":"へん","meaning":"weird/strange","type":"adjective (な)","group":"","difficulty":2,"level":0},
  {"id":"50","word":"覚える","reading":"おぼえる","meaning":"to memorize/remember","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"51","word":"花火","reading":"はなび","meaning":"fireworks","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"52","word":"着く","reading":"つく","meaning":"to arrive","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"53","word":"最近","reading":"さいきん","meaning":"recently","type":"adverb","group":"","difficulty":1,"level":0},
  {"id":"54","word":"甘い","reading":"あまい","meaning":"sweet","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"55","word":"優しい","reading":"やさしい","meaning":"kind/nice/easy","type":"adjective (い)","group":"","difficulty":2,"level":0},
  {"id":"56","word":"似ている","reading":"にている","meaning":"to be similar","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"57","word":"比べる","reading":"くらべる","meaning":"to compare","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"58","word":"文化","reading":"ぶんか","meaning":"culture","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"59","word":"尊敬する","reading":"そんけいする","meaning":"to respect","type":"verb","group":"irregular","difficulty":3,"level":0},
  {"id":"60","word":"休憩","reading":"きゅうけい","meaning":"break","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"61","word":"攻撃する","reading":"こうげきする","meaning":"to attack","type":"verb","group":"irregular","difficulty":3,"level":0},
  {"id":"62","word":"刺す","reading":"さす","meaning":"to sting","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"63","word":"参加する","reading":"さんかする","meaning":"to join/attend","type":"verb","group":"irregular","difficulty":2,"level":0},
  {"id":"64","word":"少なくとも","reading":"すくなくとも","meaning":"at least","type":"adverb","group":"","difficulty":3,"level":0},
  {"id":"65","word":"決まる","reading":"きまる","meaning":"to be decided","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"66","word":"決める","reading":"きめる","meaning":"to decide","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"67","word":"探す","reading":"さがす","meaning":"to look for","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"68","word":"怖い","reading":"こわい","meaning":"scary/scared of","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"69","word":"終わる","reading":"おわる","meaning":"to finish/end (intransitive)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"70","word":"帰る","reading":"かえる","meaning":"to go back/return","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"71","word":"帰ってくる","reading":"かえってくる","meaning":"to come back","type":"verb","group":"irregular","difficulty":2,"level":0},
  {"id":"72","word":"落ち着く","reading":"おちつく","meaning":"to calm down/be calm","type":"verb","group":"godan","difficulty":3,"level":0},
  {"id":"73","word":"引っ越す","reading":"ひっこす","meaning":"to move (in/out)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"74","word":"要る","reading":"いる","meaning":"to need","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"75","word":"疲れる","reading":"つかれる","meaning":"to be tired/tiring","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"76","word":"眠たい","reading":"ねむたい","meaning":"sleepy","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"77","word":"結婚式","reading":"けっこんしき","meaning":"wedding","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"78","word":"始まる","reading":"はじまる","meaning":"to start","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"79","word":"踊る","reading":"おどる","meaning":"to dance","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"80","word":"知り合い","reading":"しりあい","meaning":"acquaintance","type":"noun","group":"","difficulty":3,"level":0},
  {"id":"81","word":"動かす","reading":"うごかす","meaning":"to move (things)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"82","word":"欲しい","reading":"ほしい","meaning":"to want (things)","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"83","word":"使う","reading":"つかう","meaning":"to use","type":"verb","group":"godan","difficulty":1,"level":0},
  {"id":"84","word":"焼く","reading":"やく","meaning":"to grill/bake","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"85","word":"入れる","reading":"いれる","meaning":"to add/put in","type":"verb","group":"ichidan","difficulty":1,"level":0},
  {"id":"86","word":"確認する","reading":"かくにんする","meaning":"to check/confirm","type":"verb","group":"irregular","difficulty":3,"level":0},
  {"id":"87","word":"動物病院","reading":"どうぶつびょういん","meaning":"animal hospital/vet","type":"noun","group":"","difficulty":3,"level":0},
  {"id":"88","word":"吐く","reading":"はく","meaning":"to vomit","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"89","word":"見つける","reading":"みつける","meaning":"to find","type":"verb","group":"ichidan","difficulty":2,"level":0},
  {"id":"90","word":"匂い","reading":"におい","meaning":"smell","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"91","word":"臭い","reading":"くさい","meaning":"smelly/stink","type":"adjective (い)","group":"","difficulty":2,"level":0},
  {"id":"92","word":"かかる","reading":"かかる","meaning":"to take (time/cost)","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"93","word":"近い","reading":"ちかい","meaning":"close/near","type":"adjective (い)","group":"","difficulty":1,"level":0},
  {"id":"94","word":"問題","reading":"もんだい","meaning":"problem","type":"noun","group":"","difficulty":1,"level":0},
  {"id":"95","word":"読み終わる","reading":"よみおわる","meaning":"to finish reading","type":"verb","group":"godan","difficulty":2,"level":0},
  {"id":"96","word":"寂しい","reading":"さびしい","meaning":"lonely","type":"adjective (い)","group":"","difficulty":2,"level":0},
  {"id":"97","word":"上司","reading":"じょうし","meaning":"boss","type":"noun","group":"","difficulty":2,"level":0},
  {"id":"98","word":"緊急","reading":"きんきゅう","meaning":"emergency","type":"noun","group":"","difficulty":3,"level":0},
  {"id":"99","word":"獣医","reading":"じゅうい","meaning":"vet (person)","type":"noun","group":"","difficulty":3,"level":0},
  {"id":"100","word":"予算","reading":"よさん","meaning":"budget","type":"noun","group":"","difficulty":2,"level":0}
];

const LEVELS = ['New', 'Learning', 'Learning', 'Familiar', 'Familiar', 'Mastered'];
const MAX_LEVEL = 5;

const COLORS = {
  ink: '#1C1A17',
  washi: '#F1EBDD',
  washiDim: '#E8E0CC',
  seal: '#B23A2F',
  bamboo: '#5C7A5C',
  gold: '#C9A15A',
  paper2: '#FAF7EE',
};

function loadState() {
  try {
    const raw = window.localStorage ? null : null; // storage API is used instead, see below
  } catch (e) {}
  return null;
}

function App() {
  const [cards, setCards] = useState(DEFAULT_VOCAB);
  const [progress, setProgress] = useState({}); // id -> {level, seen, correct, lastSeen}
  const [screen, setScreen] = useState('home'); // home, study, stats, import
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [loaded, setLoaded] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSummary, setImportSummary] = useState('');
  const [dataView, setDataView] = useState('import'); // 'import' | 'manage'
  const [filterType, setFilterType] = useState('all');

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const savedCards = await window.storage?.get('vocab-cards');
        if (savedCards?.value) setCards(JSON.parse(savedCards.value));
      } catch (e) {}
      try {
        const savedProgress = await window.storage?.get('vocab-progress');
        if (savedProgress?.value) setProgress(JSON.parse(savedProgress.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const persistCards = useCallback(async (next) => {
    setCards(next);
    try { await window.storage?.set('vocab-cards', JSON.stringify(next)); } catch (e) {}
  }, []);

  const persistProgress = useCallback(async (next) => {
    setProgress(next);
    try { await window.storage?.set('vocab-progress', JSON.stringify(next)); } catch (e) {}
  }, []);

  const getLevel = (id) => progress[id]?.level ?? 0;

  const types = useMemo(() => {
    const s = new Set(cards.map(c => c.type).filter(Boolean));
    return ['all', ...Array.from(s)];
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (filterType === 'all') return cards;
    return cards.filter(c => c.type === filterType);
  }, [cards, filterType]);

  const stats = useMemo(() => {
    const total = cards.length;
    let mastered = 0, learning = 0, fresh = 0;
    cards.forEach(c => {
      const lvl = getLevel(c.id);
      if (lvl >= 5) mastered++;
      else if (lvl > 0) learning++;
      else fresh++;
    });
    return { total, mastered, learning, fresh };
  }, [cards, progress]);

  function buildQueue(list) {
    // weight lower-level / less-recently-seen cards higher
    const weighted = list.map(c => {
      const p = progress[c.id];
      const level = p?.level ?? 0;
      const weight = (MAX_LEVEL - level) + 1;
      return { card: c, weight };
    });
    const pool = [];
    weighted.forEach(({ card, weight }) => {
      for (let i = 0; i < weight; i++) pool.push(card);
    });
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // dedupe consecutive & cap to reasonable session size
    const seen = new Set();
    const result = [];
    for (const c of pool) {
      if (result.length >= 20) break;
      if (!seen.has(c.id) || result.length < list.length) {
        result.push(c);
        seen.add(c.id);
      }
    }
    return result.slice(0, Math.max(10, Math.min(20, list.length)));
  }

  function startSession() {
    if (filteredCards.length === 0) return;
    setQueue(buildQueue(filteredCards));
    setCurrent(0);
    setFlipped(false);
    setSessionStats({ correct: 0, wrong: 0 });
    setScreen('study');
  }

  function answer(correct) {
    const card = queue[current];
    if (!card || !flipped) return;
    const prev = progress[card.id] || { level: 0, seen: 0, correct: 0 };
    const nextLevel = correct
      ? Math.min(MAX_LEVEL, prev.level + 1)
      : Math.max(0, prev.level - 1);
    const nextProgress = {
      ...progress,
      [card.id]: {
        level: nextLevel,
        seen: (prev.seen || 0) + 1,
        correct: (prev.correct || 0) + (correct ? 1 : 0),
        lastSeen: Date.now(),
      },
    };
    persistProgress(nextProgress);
    setSessionStats(s => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
    }));
    setFlipped(false);
    if (current + 1 < queue.length) {
      setCurrent(current + 1);
    } else {
      setScreen('sessionEnd');
    }
  }

  function handleImport() {
    setImportError('');
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array of cards');

      // Build a lookup of existing entries so we can skip duplicates.
      // Two cards are considered "the same word" if their word+reading match
      // (falls back to word alone if reading is missing).
      const dupeKey = (c) => `${(c.word || '').trim()}::${(c.reading || '').trim()}`;
      const existingKeys = new Set(cards.map(dupeKey));

      const incoming = parsed.map((c, i) => ({
        id: String(c.id ?? `imp-${Date.now()}-${i}`),
        word: c.word ?? '',
        reading: c.reading ?? '',
        meaning: c.meaning ?? '',
        type: c.type ?? '',
        group: c.group ?? '',
        difficulty: c.difficulty ?? 1,
        level: 0,
      }));

      const newOnes = [];
      const seenThisBatch = new Set();
      for (const c of incoming) {
        const key = dupeKey(c);
        if (!c.word) continue; // skip malformed entries with no word
        if (existingKeys.has(key) || seenThisBatch.has(key)) continue; // duplicate, skip
        seenThisBatch.add(key);
        newOnes.push(c);
      }

      const merged = [...cards, ...newOnes];
      persistCards(merged);
      setImportText('');
      setImportSummary(`Added ${newOnes.length} new word${newOnes.length === 1 ? '' : 's'} to your collection (${incoming.length - newOnes.length} duplicate${incoming.length - newOnes.length === 1 ? '' : 's'} skipped).`);
      setScreen('home');
    } catch (e) {
      setImportError('Could not parse that as JSON: ' + e.message);
    }
  }

  function removeCard(id) {
    const nextCards = cards.filter(c => c.id !== id);
    persistCards(nextCards);
    if (progress[id]) {
      const nextProgress = { ...progress };
      delete nextProgress[id];
      persistProgress(nextProgress);
    }
  }

  function exportData() {
    const data = cards.map(c => ({ ...c, level: getLevel(c.id) }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocab-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetProgress() {
    persistProgress({});
  }

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: COLORS.washi, fontFamily: 'Inter, sans-serif', color: COLORS.ink }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: COLORS.washi,
      color: COLORS.ink,
      minHeight: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px 40px',
      boxSizing: 'border-box',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .jp { font-family: 'Noto Serif JP', serif; }
        .card-shadow { box-shadow: 0 1px 2px rgba(28,26,23,0.06), 0 8px 24px rgba(28,26,23,0.10); }
        .hanko {
          width: 46px; height: 46px; border-radius: 6px;
          border: 2.5px solid ${COLORS.seal};
          display: flex; align-items: center; justify-content: center;
          font-family: 'Noto Serif JP', serif; font-weight: 700; font-size: 13px;
          color: ${COLORS.seal}; flex-shrink: 0; letter-spacing: -1px;
          transform: rotate(-2deg);
        }
        button { font-family: inherit; cursor: pointer; }
        .btn-primary {
          background: ${COLORS.ink}; color: ${COLORS.washi}; border: none;
          padding: 13px 22px; border-radius: 8px; font-weight: 600; font-size: 15px;
          transition: transform 0.12s ease, opacity 0.12s ease;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
        .btn-ghost {
          background: transparent; color: ${COLORS.ink}; border: 1.5px solid ${COLORS.ink}22;
          padding: 11px 18px; border-radius: 8px; font-weight: 500; font-size: 14px;
        }
        .btn-ghost:hover { border-color: ${COLORS.ink}55; }
        .tab {
          background: transparent; border: none; padding: 8px 14px; border-radius: 20px;
          font-size: 13px; font-weight: 500; color: ${COLORS.ink}99;
        }
        .tab.active { background: ${COLORS.ink}; color: ${COLORS.washi}; }
        .flip-card {
          perspective: 1200px;
        }
        .flip-inner {
          transition: transform 0.45s cubic-bezier(.4,.2,.2,1);
          transform-style: preserve-3d;
          position: relative;
        }
        .flip-inner.flipped { transform: rotateY(180deg); }
        .flip-face {
          backface-visibility: hidden;
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .flip-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .flip-inner { transition: none; }
        }
      `}</style>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="hanko">習</div>
          <div>
            <div className="jp" style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>単語帳</div>
            <div style={{ fontSize: 11.5, color: `${COLORS.ink}88`, marginTop: 1 }}>Vocab Drill</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, background: COLORS.washiDim, padding: 4, borderRadius: 24 }}>
          <button className={`tab ${screen === 'home' || screen === 'study' || screen === 'sessionEnd' ? 'active' : ''}`} onClick={() => setScreen('home')}>Study</button>
          <button className={`tab ${screen === 'stats' ? 'active' : ''}`} onClick={() => setScreen('stats')}>Stats</button>
          <button className={`tab ${screen === 'import' ? 'active' : ''}`} onClick={() => setScreen('import')}>Data</button>
        </div>
      </div>

      {screen === 'home' && (
        <div style={{ width: '100%', maxWidth: 480 }}>
          {/* progress stamps */}
          <div className="card-shadow" style={{ background: COLORS.paper2, borderRadius: 14, padding: 20, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: `${COLORS.seal}0d` }} />
            <div style={{ fontSize: 13, color: `${COLORS.ink}99`, marginBottom: 10, fontWeight: 500 }}>Progress</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {cards.slice(0, 40).map(c => {
                const lvl = getLevel(c.id);
                const color = lvl >= 5 ? COLORS.bamboo : lvl > 0 ? COLORS.gold : `${COLORS.ink}22`;
                return <div key={c.id} title={`${c.word} — level ${lvl}`} style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />;
              })}
              {cards.length > 40 && <span style={{ fontSize: 11, color: `${COLORS.ink}66` }}>+{cards.length - 40}</span>}
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 13 }}>
              <span><b style={{ color: COLORS.bamboo }}>{stats.mastered}</b> mastered</span>
              <span><b style={{ color: COLORS.gold }}>{stats.learning}</b> learning</span>
              <span><b style={{ color: `${COLORS.ink}77` }}>{stats.fresh}</b> new</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: `${COLORS.ink}99` }}>Filter by type</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {types.map(t => (
                <button key={t} onClick={() => setFilterType(t)} className="btn-ghost"
                  style={{
                    padding: '6px 12px', fontSize: 12.5,
                    background: filterType === t ? COLORS.ink : 'transparent',
                    color: filterType === t ? COLORS.washi : COLORS.ink,
                    borderColor: filterType === t ? COLORS.ink : `${COLORS.ink}22`,
                  }}>
                  {t} {t !== 'all' ? `(${cards.filter(c => c.type === t).length})` : `(${cards.length})`}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', fontSize: 16, padding: '16px 22px' }} onClick={startSession} disabled={filteredCards.length === 0}>
            Start session ({Math.min(20, filteredCards.length)} cards)
          </button>
        </div>
      )}

      {screen === 'study' && queue[current] && (
        <StudyCard
          card={queue[current]}
          index={current}
          total={queue.length}
          flipped={flipped}
          onFlip={() => setFlipped(f => !f)}
          onAnswer={answer}
          level={getLevel(queue[current].id)}
        />
      )}

      {screen === 'sessionEnd' && (
        <div style={{ width: '100%', maxWidth: 480, textAlign: 'center', paddingTop: 40 }}>
          <div className="hanko" style={{ margin: '0 auto 20px', width: 64, height: 64, fontSize: 18 }}>終</div>
          <div className="jp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Session complete</div>
          <div style={{ fontSize: 14, color: `${COLORS.ink}88`, marginBottom: 24 }}>
            {sessionStats.correct} correct · {sessionStats.wrong} to review again
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-ghost" onClick={() => setScreen('home')}>Back home</button>
            <button className="btn-primary" onClick={startSession}>Study again</button>
          </div>
        </div>
      )}

      {screen === 'stats' && (
        <StatsView cards={cards} progress={progress} onReset={resetProgress} onExport={exportData} />
      )}

      {screen === 'import' && (
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: COLORS.washiDim, padding: 4, borderRadius: 24, width: 'fit-content' }}>
            <button className={`tab ${dataView === 'import' ? 'active' : ''}`} onClick={() => setDataView('import')}>Import / Export</button>
            <button className={`tab ${dataView === 'manage' ? 'active' : ''}`} onClick={() => setDataView('manage')}>Manage words ({cards.length})</button>
          </div>

          {dataView === 'import' && (
            <ImportView
              importText={importText}
              setImportText={setImportText}
              importError={importError}
              importSummary={importSummary}
              onImport={handleImport}
              onExport={exportData}
              cardCount={cards.length}
            />
          )}

          {dataView === 'manage' && (
            <ManageView cards={cards} onRemove={removeCard} />
          )}
        </div>
      )}
    </div>
  );
}

function StudyCard({ card, index, total, flipped, onFlip, onAnswer, level }) {
  const levelColor = level >= 5 ? COLORS.bamboo : level > 0 ? COLORS.gold : `${COLORS.ink}33`;
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, fontSize: 13, color: `${COLORS.ink}88` }}>
        <span>{index + 1} / {total}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: levelColor }} />
          {LEVELS[level] || 'New'}
        </span>
      </div>

      <div className="flip-card" style={{ height: 260, marginBottom: 20 }} onClick={onFlip}>
        <div key={card.id} className={`flip-inner card-shadow ${flipped ? 'flipped' : ''}`} style={{ width: '100%', height: '100%', borderRadius: 16, background: COLORS.paper2, cursor: 'pointer' }}>
          <div className="flip-face" style={{ padding: 24, textAlign: 'center' }}>
            {card.reading && card.reading !== card.word && (
              <div className="jp" style={{ fontSize: 16, color: `${COLORS.ink}88`, marginBottom: 6, letterSpacing: 1 }}>{card.reading}</div>
            )}
            <div className="jp" style={{ fontSize: 44, fontWeight: 700, marginBottom: 10 }}>{card.word}</div>
            {card.type && <div style={{ fontSize: 12, color: `${COLORS.ink}66`, textTransform: 'uppercase', letterSpacing: 0.5 }}>{card.type}{card.group ? ` · ${card.group}` : ''}</div>}
            <div style={{ position: 'absolute', bottom: 18, fontSize: 12, color: `${COLORS.ink}55` }}>Tap to reveal</div>
          </div>
          <div className="flip-face flip-back" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{card.meaning}</div>
          </div>
        </div>
      </div>

      {flipped ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderColor: `${COLORS.seal}55`, color: COLORS.seal }} onClick={() => onAnswer(false)}>
            ✕ Didn't know
          </button>
          <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: COLORS.bamboo }} onClick={() => onAnswer(true)}>
            ✓ Knew it
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: 13, color: `${COLORS.ink}55` }}>Tap the card to see the answer</div>
      )}
    </div>
  );
}

function StatsView({ cards, progress, onReset, onExport }) {
  const rows = useMemo(() => {
    return [...cards].sort((a, b) => {
      const la = progress[a.id]?.level ?? 0;
      const lb = progress[b.id]?.level ?? 0;
      return la - lb;
    });
  }, [cards, progress]);

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>All words</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5 }} onClick={onExport}>
            ↓ Export
          </button>
          <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 5, color: COLORS.seal, borderColor: `${COLORS.seal}44` }} onClick={onReset}>
            ↺ Reset
          </button>
        </div>
      </div>
      <div className="card-shadow" style={{ background: COLORS.paper2, borderRadius: 14, overflow: 'hidden' }}>
        {rows.map((c, i) => {
          const p = progress[c.id];
          const level = p?.level ?? 0;
          const color = level >= 5 ? COLORS.bamboo : level > 0 ? COLORS.gold : `${COLORS.ink}33`;
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.ink}0d` : 'none' }}>
              <div className="jp" style={{ fontSize: 17, fontWeight: 600, width: 78, flexShrink: 0 }}>{c.word}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: `${COLORS.ink}99` }}>{c.reading}</div>
                <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.meaning}</div>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: MAX_LEVEL }).map((_, j) => (
                  <div key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: j < level ? color : `${COLORS.ink}18` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImportView({ importText, setImportText, importError, importSummary, onImport, onExport, cardCount }) {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Add to your word collection</div>
      <div style={{ fontSize: 13, color: `${COLORS.ink}88`, marginBottom: 14, lineHeight: 1.5 }}>
        Paste a JSON array of cards below. Each card needs <code>word</code>, <code>reading</code>, and <code>meaning</code>. Optional: <code>type</code>, <code>group</code>, <code>difficulty</code>. New words are merged into your current {cardCount}-card collection — anything matching an existing word + reading is skipped as a duplicate, and your progress is never touched.
      </div>
      {importSummary && (
        <div style={{ fontSize: 13, color: COLORS.bamboo, background: `${COLORS.bamboo}14`, padding: '10px 12px', borderRadius: 8, marginBottom: 12 }}>
          {importSummary}
        </div>
      )}
      <textarea
        value={importText}
        onChange={e => setImportText(e.target.value)}
        placeholder={'[\n  {"word":"食べる","reading":"たべる","meaning":"to eat","type":"verb","difficulty":1}\n]'}
        style={{
          width: '100%', height: 200, padding: 12, borderRadius: 10, border: `1.5px solid ${COLORS.ink}22`,
          background: COLORS.paper2, fontFamily: 'monospace', fontSize: 12.5, resize: 'vertical', marginBottom: 10,
        }}
      />
      {importError && <div style={{ color: COLORS.seal, fontSize: 12.5, marginBottom: 10 }}>{importError}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={onImport} disabled={!importText.trim()}>
          ↑ Add new words
        </button>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={onExport}>
          ↓ Export current collection
        </button>
      </div>
    </div>
  );
}

function ManageView({ cards, onRemove }) {
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(c =>
      (c.word || '').toLowerCase().includes(q) ||
      (c.reading || '').toLowerCase().includes(q) ||
      (c.meaning || '').toLowerCase().includes(q)
    );
  }, [cards, search]);

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search word, reading, or meaning…"
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${COLORS.ink}22`,
          background: COLORS.paper2, fontSize: 13.5, marginBottom: 12, boxSizing: 'border-box',
        }}
      />
      {filtered.length === 0 && (
        <div style={{ fontSize: 13, color: `${COLORS.ink}66`, textAlign: 'center', padding: '30px 0' }}>
          {cards.length === 0 ? 'No words yet.' : 'No matches.'}
        </div>
      )}
      <div className="card-shadow" style={{ background: COLORS.paper2, borderRadius: 14, overflow: 'hidden' }}>
        {filtered.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.ink}0d` : 'none' }}>
            <div className="jp" style={{ fontSize: 17, fontWeight: 600, width: 78, flexShrink: 0 }}>{c.word}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: `${COLORS.ink}99` }}>{c.reading}</div>
              <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.meaning}</div>
            </div>
            {confirmId === c.id ? (
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => { onRemove(c.id); setConfirmId(null); }}
                  style={{ background: COLORS.seal, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, fontWeight: 600 }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  style={{ background: 'transparent', color: `${COLORS.ink}88`, border: `1px solid ${COLORS.ink}22`, borderRadius: 6, padding: '5px 10px', fontSize: 12 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmId(c.id)}
                title="Remove this word"
                style={{ background: 'transparent', color: COLORS.seal, border: `1px solid ${COLORS.seal}44`, borderRadius: 6, padding: '5px 10px', fontSize: 12, flexShrink: 0 }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

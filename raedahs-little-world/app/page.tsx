"use client";

import { useEffect, useRef, useState } from "react";

type Scene = "letter" | "midnight" | "game" | "favorites" | "matching" | "wordsearch" | "gifmatch";
type MatchCard = { id: string; pairKey: string; label: string };
type MatchCategory = { id: string; label: string; icon: string; pairs: string[] };
type WordSearchCategory = { id: string; label: string; icon: string; words: string[] };

const PETAL_COUNT = 20;
const WORD_SEARCH_SIZE = 15;

const tracks = [
  { id: "moonlit", name: "Moonlit bloom", mood: "warm keys + sleepy bass", chords: [[220, 277.18, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66], [164.81, 207.65, 246.94]], melody: [659.25, 587.33, 493.88, 523.25], pace: 3600 },
  { id: "mint", name: "Mint after rain", mood: "soft rain-room loop", chords: [[196, 246.94, 293.66], [146.83, 196, 246.94], [174.61, 220, 261.63], [164.81, 207.65, 246.94]], melody: [587.33, 659.25, 698.46, 587.33], pace: 3900 },
  { id: "pink", name: "Pink lanterns", mood: "late-night slow dance", chords: [[246.94, 293.66, 369.99], [196, 246.94, 293.66], [220, 261.63, 329.63], [174.61, 220, 277.18]], melody: [739.99, 659.25, 587.33, 523.25], pace: 3800 },
];

const fanGifs = [
  { label: "Zoro", src: "https://media1.tenor.com/m/6hpHOoi5ezkAAAAd/one-piece-zoro.gif", href: "https://tenor.com/view/one-piece-zoro-gif-16868873670997146425" },
  { label: "Stray Kids", src: "https://media1.tenor.com/m/fpCx57JtiQAAAAAd/stray-kids.gif", href: "https://tenor.com/view/stray-kids-studio-choom-thunderous-gif-22867876" },
  { label: "Eren", src: "https://media1.tenor.com/m/J4JmyQx91dYAAAAd/eren-eren-yeager.gif", href: "https://tenor.com/view/eren-eren-yeager-attack-on-titan-shingeki-no-kyojin-drip-gif-20142140" },
  { label: "Mark", src: "https://media1.tenor.com/m/uw_bqeDdsv8AAAAd/mark-ruffalo-smiling.gif", href: "https://tenor.com/view/mark-ruffalo-smiling-cute-gif-14356534" },
  { label: "Zenitsu", src: "https://media1.tenor.com/m/-DmvUlNxxpUAAAAd/zenitsu-zenitsu-agatsuma.gif", href: "https://tenor.com/view/zenitsu-zenitsu-agatsuma-kimetsu-kimetsu-no-yaiba-demon-slayer-gif-21548159" },
  { label: "Hulk mood", src: "https://media1.tenor.com/m/OJIque1yFvIAAAAd/mark-ruffalo-the-avengers.gif", href: "https://tenor.com/view/mark-ruffalo-the-avengers-hulk-puzzling-hmm-gif-5235621" },
];

const petalWishes = [
  "a tiny wish for you: may tomorrow surprise you in a sweet way.",
  "you caught a soft little reminder: you make people feel safe.",
  "this petal says: drink water, play your favorite song, be cute about it.",
  "you are allowed to take up space and still be the gentlest person in the room.",
  "Zoro says he is proud of you. he is also very lost, but he means it.",
  "lily alert: you deserve the kind of joy that finds you for no reason.",
  "this one is sparkly because you are. sorry, i do not make the rules.",
  "a tiny hug from me, saved in petal form. keep it.",
];

const zoroDirections = [
  "turn left at the moon, then take three wrong turns. you are now in a different anime.",
  "walk straight for five minutes. congratulations, you have somehow found a lily shop.",
  "ask Luffy. immediately regret asking Luffy.",
  "follow the pink petals. do not follow Zoro. this is for everyone’s safety.",
  "the destination was friendship the whole time. unfortunately, Zoro is still somewhere else.",
];

const chaosLines = [
  "Could this wall BE any more yours? ☕",
  "Bruno has entered the room. everybody act normal. impossible.",
  "Zenitsu-level panic, but make it pastel and adorable.",
  "Hulk says: tiny problems deserve dramatic reactions too.",
  "Stray Kids dance break has been legally required by the moon.",
];

const matchingCategories: MatchCategory[] = [
  { id: "friends", label: "Friends", icon: "☕", pairs: ["Monica", "Rachel", "Phoebe", "Joey", "Chandler", "Ross", "Central Perk", "Smelly Cat", "Pivot", "Unagi", "On a break", "How you doin'?", "The One With…", "Coffeehouse", "Apartment 20", "Thanksgiving turkey", "Cup of coffee", "Lobster", "Hugsy", "Janice", "Gunther", "Regina Phalange", "Miss Chanandler Bong", "Princess Consuela", "Holiday Armadillo", "Rock Paper Scissors", "Chick", "Duck", "Cheesecake", "Orange sofa"] },
  { id: "one-piece", label: "One Piece", icon: "⚔", pairs: ["Luffy", "Zoro", "Nami", "Robin", "Sanji", "Chopper", "Usopp", "Ace", "Law", "Shanks", "Vivi", "Brook", "Franky", "Jinbe", "Yamato", "Going Merry", "Thousand Sunny", "Straw Hat", "Wado Ichimonji", "Log Pose", "Devil Fruit", "Grand Line", "Wano", "Alabasta", "Skypiea", "Haki", "Bounty", "Marineford", "Sabo", "Chopper's Hat"] },
  { id: "demon-slayer", label: "Demon Slayer", icon: "⚡", pairs: ["Tanjiro", "Nezuko", "Zenitsu", "Inosuke", "Giyu", "Shinobu", "Rengoku", "Mitsuri", "Muichiro", "Obanai", "Kanao", "Genya", "Tengen", "Muzan", "Akaza", "Doma", "Kokushibo", "Kagaya", "Ubuyashiki", "Swordsmith Village", "Mugen Train", "Hashira", "Nichirin Blade", "Wisteria", "Demon Corps", "Butterfly Mansion", "Entertainment District", "Infinity Castle", "Final Selection", "Kamado Box"] },
  { id: "ghost-stories", label: "Ghost Stories", icon: "☾", pairs: ["Satsuki", "Keiichiro", "Hajime", "Momoko", "Leo", "Amanojaku", "Kaya", "Ghost Journal", "Old School", "Piano Ghost", "Red Paper", "Blue Paper", "Kutabe", "Hanako", "Running Girl", "Death Nurse", "Da Vinci", "Shinigami", "Great Tree", "Haunted Toilet", "Amanogawa", "Reo", "Mr. Sakata", "Kayako", "Reiichiro", "Sports Festival", "Mirror Ghost", "Tunnel Ghost", "Dream Eater", "Ghost Stories"] },
  { id: "marvel", label: "Marvel", icon: "💚", pairs: ["Hulk", "Bruce Banner", "Natasha", "Tony Stark", "Steve Rogers", "Thor", "Clint", "Wanda", "Peter Parker", "Doctor Strange", "Loki", "Rocket", "Groot", "Gamora", "Nebula", "Thanos", "Avengers", "Infinity Stones", "Mjolnir", "Vibranium", "Wakanda", "Asgard", "Quinjet", "Arc Reactor", "S.H.I.E.L.D.", "Black Widow", "Captain America", "Iron Man", "Guardians", "Endgame"] },
  { id: "stray-kids", label: "Stray Kids", icon: "🎤", pairs: ["Bang Chan", "Lee Know", "Changbin", "Hyunjin", "Han", "Felix", "Seungmin", "I.N", "God's Menu", "MANIAC", "Thunderous", "S-Class", "Case 143", "Back Door", "Miroh", "Red Lights", "LALALALA", "ATE", "3RACHA", "Danceracha", "Vocalracha", "STAY", "Lightstick", "Mixtape", "District 9", "Double Knot", "Charmer", "Domino", "Cheese", "Hall of Fame"] },
];

const wordSearchCategories: WordSearchCategory[] = [
  { id: "friends", label: "Friends", icon: "☕", words: ["MONICA", "RACHEL", "PHOEBE", "JOEY", "CHANDLER", "ROSS", "LOBSTER", "UNAGI", "CENTRALPERK", "SMELLYCAT"] },
  { id: "one-piece", label: "One Piece", icon: "⚔", words: ["ZORO", "LUFFY", "NAMI", "ROBIN", "SANJI", "CHOPPER", "USOPP", "ACE", "GRANDLINE", "STRAWHAT"] },
  { id: "demon-slayer", label: "Demon Slayer", icon: "⚡", words: ["TANJIRO", "NEZUKO", "ZENITSU", "INOSUKE", "GIYU", "SHINOBU", "RENGOKU", "HASHIRA", "MUZAN", "NICHRIN"] },
  { id: "ghost-stories", label: "Ghost Stories", icon: "☾", words: ["SATSUKI", "KEIICHIRO", "HAJIME", "MOMOKO", "LEO", "AMANOJAKU", "KAYA", "GHOSTJOURNAL", "OLDSCHOOL", "PIANOGHOST"] },
  { id: "marvel", label: "Marvel", icon: "💚", words: ["HULK", "IRONMAN", "THOR", "LOKI", "WANDA", "NATASHA", "ROCKET", "GROOT", "AVENGERS", "WAKANDA"] },
  { id: "stray-kids", label: "Stray Kids", icon: "🎤", words: ["BANGCHAN", "LEEKNOw", "CHANGBIN", "HYUNJIN", "HAN", "FELIX", "SEUNGMIN", "THUNDEROUS", "MANIAC", "SKZ"] },
  { id: "night-garden", label: "Night Garden", icon: "✿", words: ["LILY", "PETAL", "MOON", "MINT", "CHERRYBLOSSOM", "FIREWORK", "STARLIGHT", "WISH", "GARDEN", "FOREVER"] },
].map((category) => ({ ...category, words: category.words.map((word) => word.toUpperCase()) }));

const gifMatchItems = [
  { id: "friends", category: "Friends", name: "Monica & Rachel", src: "https://media1.tenor.com/m/iEO777xifaUAAAAd/friends-monica.gif" },
  { id: "one-piece", category: "One Piece", name: "Zoro", src: "https://media1.tenor.com/m/6hpHOoi5ezkAAAAd/one-piece-zoro.gif" },
  { id: "demon-slayer", category: "Demon Slayer", name: "Nezuko", src: "https://media1.tenor.com/m/Rnc-Be3vfxYAAAAd/demon-slayer-nezuko.gif" },
  { id: "ghost-stories", category: "Ghost Stories", name: "Keiichiro", src: "https://media1.tenor.com/m/rHf9HuZyIYcAAAAd/keichiro-ghost-stories.gif" },
  { id: "marvel", category: "Marvel", name: "Hulk", src: "https://media1.tenor.com/m/eI56KLyo-mAAAAAd/avengers-hulk.gif" },
  { id: "stray-kids", category: "Stray Kids", name: "Stray Kids", src: "https://media1.tenor.com/m/fpCx57JtiQAAAAAd/stray-kids.gif" },
];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function makeMatchingDeck(categoryId: string): MatchCard[] {
  const category = matchingCategories.find(({ id }) => id === categoryId) ?? matchingCategories[0];
  return shuffle(category.pairs.flatMap((label, pairIndex) => [
    { id: `${category.id}-${pairIndex}-a`, pairKey: `${category.id}-${pairIndex}`, label },
    { id: `${category.id}-${pairIndex}-b`, pairKey: `${category.id}-${pairIndex}`, label },
  ]));
}

function buildWordSearch(category: WordSearchCategory) {
  const grid = Array.from({ length: WORD_SEARCH_SIZE }, (_, row) => Array.from({ length: WORD_SEARCH_SIZE }, (_, column) => String.fromCharCode(65 + ((row * 11 + column * 7 + category.id.length * 3) % 26))));
  const words = category.words.map((word, row) => {
    const startColumn = (row * 3 + category.id.length) % (WORD_SEARCH_SIZE - word.length + 1);
    const path = Array.from({ length: word.length }, (_, column) => row * WORD_SEARCH_SIZE + startColumn + column);
    word.split("").forEach((letter, column) => { grid[row][startColumn + column] = letter; });
    return { word, path };
  });
  return { grid: grid.flat(), words };
}

function FallingPetals({ count = 34 }: { count?: number }) {
  return <div className="falling-petals" aria-hidden="true">{Array.from({ length: count }, (_, index) => <i key={index} style={{ left: `${(index * 19 + 4) % 100}%`, animationDelay: `${-index * 0.73}s`, animationDuration: `${8 + (index % 5) * 1.17}s` }} />)}</div>;
}

function Fireworks({ className = "" }: { className?: string }) {
  return <div className={`petal-fireworks ${className}`} aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <i key={index} className={`petal-firework firework-${index % 5}`} style={{ left: `${8 + (index * 31) % 84}%`, top: `${8 + (index * 19) % 65}%`, animationDelay: `${index * 0.14}s` }} />)}</div>;
}

function GameFinish({ title, copy }: { title: string; copy: string }) {
  return <div className="game-finish" role="status"><Fireworks className="finish-fireworks" /><i>⚜</i><div><p>your surprise gift</p><h3>{title}</h3><span>{copy}</span></div></div>;
}

export default function Home() {
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [caught, setCaught] = useState<number[]>([]);
  const [petalWish, setPetalWish] = useState("catch a petal. it has something cute to say.");
  const [wallLine, setWallLine] = useState("tap anything. this wall is meant to be a little ridiculous.");
  const [lilyCount, setLilyCount] = useState(0);
  const [zoroDirection, setZoroDirection] = useState("need directions? this is already risky.");
  const [matchingCategoryId, setMatchingCategoryId] = useState(matchingCategories[0].id);
  const [matchingDeck, setMatchingDeck] = useState<MatchCard[]>([]);
  const [flippedMatchCards, setFlippedMatchCards] = useState<string[]>([]);
  const [matchedMatchCards, setMatchedMatchCards] = useState<string[]>([]);
  const [matchingTurns, setMatchingTurns] = useState(0);
  const [matchingMistakes, setMatchingMistakes] = useState(0);
  const [matchingCompletedCategories, setMatchingCompletedCategories] = useState<string[]>([]);
  const [matchingNote, setMatchingNote] = useState("choose a category, then find all 30 pairs.");
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [wordCategoryId, setWordCategoryId] = useState(wordSearchCategories[0].id);
  const [wordStart, setWordStart] = useState<number | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [completedWordCategories, setCompletedWordCategories] = useState<string[]>([]);
  const [wordHint, setWordHint] = useState("every hidden word reads left to right — tap its first and last letter.");
  const [gifOrder, setGifOrder] = useState(gifMatchItems.map(({ id }) => id));
  const [selectedGifName, setSelectedGifName] = useState<string | null>(null);
  const [matchedGifItems, setMatchedGifItems] = useState<string[]>([]);
  const [gifNote, setGifNote] = useState("tap a name, then tap the GIF that belongs with it.");
  const audioRef = useRef<AudioContext | null>(null);
  const loopRef = useRef<number | null>(null);
  const matchTimeoutRef = useRef<number | null>(null);

  const stopMusic = () => {
    if (loopRef.current) window.clearTimeout(loopRef.current);
    loopRef.current = null;
    if (audioRef.current) void audioRef.current.close();
    audioRef.current = null;
    setTrackId(null);
  };

  const playTrack = (id: string) => {
    if (trackId === id) return;
    if (loopRef.current) window.clearTimeout(loopRef.current);
    if (audioRef.current) void audioRef.current.close();
    const context = new AudioContext();
    audioRef.current = context;
    const selected = tracks.find((track) => track.id === id) ?? tracks[0];
    let step = 0;
    const tone = (frequency: number, start: number, duration: number, level: number, type: OscillatorType) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + 0.16);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.1);
    };
    const playLoop = () => {
      if (audioRef.current !== context) return;
      if (context.state === "suspended") void context.resume();
      const now = context.currentTime;
      const chord = selected.chords[step % selected.chords.length];
      chord.forEach((note, index) => tone(note, now + index * 0.02, 4.3, 0.03 / (index + 1), index === 0 ? "triangle" : "sine"));
      tone(chord[0] / 2, now, 3.9, 0.04, "sine");
      tone(selected.melody[step % selected.melody.length], now + 1.08, 2.2, 0.018, "sine");
      tone(selected.melody[(step + 2) % selected.melody.length] / 2, now + 2.32, 1.45, 0.011, "triangle");
      step += 1;
      loopRef.current = window.setTimeout(playLoop, selected.pace);
    };
    playLoop();
    setTrackId(id);
  };

  useEffect(() => () => stopMusic(), []);
  useEffect(() => {
    const resumeMusic = () => {
      if (document.visibilityState === "visible" && audioRef.current?.state === "suspended") void audioRef.current.resume();
    };
    document.addEventListener("visibilitychange", resumeMusic);
    return () => document.removeEventListener("visibilitychange", resumeMusic);
  }, []);
  useEffect(() => {
    setMatchingDeck(makeMatchingDeck(matchingCategories[0].id));
    setGifOrder(shuffle(gifMatchItems.map(({ id }) => id)));
    return () => { if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current); };
  }, []);

  const closeScene = () => setActiveScene(null);
  const catchPetal = (index: number) => {
    setCaught((items) => items.includes(index) ? items : [...items, index]);
    setPetalWish(petalWishes[index % petalWishes.length]);
  };
  const startMatchingGame = (categoryId = matchingCategoryId, note = "fresh deck! find all 30 pairs.") => {
    if (matchTimeoutRef.current) window.clearTimeout(matchTimeoutRef.current);
    matchTimeoutRef.current = null;
    setMatchingCategoryId(categoryId);
    setMatchingDeck(makeMatchingDeck(categoryId));
    setFlippedMatchCards([]);
    setMatchedMatchCards([]);
    setMatchingTurns(0);
    setMatchingMistakes(0);
    setCheckingMatch(false);
    setMatchingNote(note);
  };
  const chooseMatchCard = (card: MatchCard) => {
    if (checkingMatch || flippedMatchCards.includes(card.id) || matchedMatchCards.includes(card.id)) return;
    const nextFlipped = [...flippedMatchCards, card.id];
    setFlippedMatchCards(nextFlipped);
    if (nextFlipped.length < 2) {
      setMatchingNote("one card open — find its twin.");
      return;
    }
    const firstCard = matchingDeck.find(({ id }) => id === nextFlipped[0]);
    const isMatch = firstCard?.pairKey === card.pairKey;
    setMatchingTurns((turns) => turns + 1);
    setCheckingMatch(true);
    if (isMatch) {
      const completedCardCount = matchedMatchCards.length + 2;
      setMatchedMatchCards((cards) => [...cards, ...nextFlipped]);
      setFlippedMatchCards([]);
      setCheckingMatch(false);
      if (completedCardCount === matchingDeck.length) {
        setMatchingCompletedCategories((categories) => categories.includes(matchingCategoryId) ? categories : [...categories, matchingCategoryId]);
        setMatchingNote("all 30 pairs found! this category is safely in your garden. ✦");
      } else setMatchingNote("a perfect match! keep the glow going.");
      return;
    }
    const nextMistakes = matchingMistakes + 1;
    setMatchingMistakes(nextMistakes);
    if (nextMistakes === 6) {
      const currentCategory = matchingCategoryId;
      setMatchingNote("six misses — this deck is reshuffling, but every other category stays safe.");
      matchTimeoutRef.current = window.setTimeout(() => startMatchingGame(currentCategory, "this category restarted with six fresh chances."), 950);
      return;
    }
    setMatchingNote(`not quite — ${6 - nextMistakes} chances left in this category.`);
    matchTimeoutRef.current = window.setTimeout(() => {
      setFlippedMatchCards([]);
      setCheckingMatch(false);
      matchTimeoutRef.current = null;
    }, 850);
  };
  const startWordSearch = (categoryId: string) => {
    setWordCategoryId(categoryId);
    setFoundWords([]);
    setWordStart(null);
    setWordHint("every hidden word reads left to right — tap its first and last letter.");
  };
  const traceWord = (start: number, end: number) => {
    const startRow = Math.floor(start / WORD_SEARCH_SIZE);
    const startColumn = start % WORD_SEARCH_SIZE;
    const endRow = Math.floor(end / WORD_SEARCH_SIZE);
    const endColumn = end % WORD_SEARCH_SIZE;
    const rowDistance = endRow - startRow;
    const columnDistance = endColumn - startColumn;
    const steps = Math.max(Math.abs(rowDistance), Math.abs(columnDistance));
    if (!steps || !(rowDistance === 0 || columnDistance === 0 || Math.abs(rowDistance) === Math.abs(columnDistance))) return [];
    return Array.from({ length: steps + 1 }, (_, index) => (startRow + index * Math.sign(rowDistance)) * WORD_SEARCH_SIZE + startColumn + index * Math.sign(columnDistance));
  };
  const chooseWordCell = (index: number, words: { word: string; path: number[] }[]) => {
    if (wordStart === null) {
      setWordStart(index);
      setWordHint("now tap the last letter of that same word.");
      return;
    }
    const attempt = traceWord(wordStart, index);
    setWordStart(null);
    const match = words.find(({ path }) => path.length === attempt.length && (path.every((cell, cellIndex) => cell === attempt[cellIndex]) || path.every((cell, cellIndex) => cell === attempt[attempt.length - 1 - cellIndex])));
    if (match && !foundWords.includes(match.word)) {
      const nextFound = [...foundWords, match.word];
      setFoundWords(nextFound);
      if (nextFound.length === words.length) {
        setCompletedWordCategories((categories) => categories.includes(wordCategoryId) ? categories : [...categories, wordCategoryId]);
        setWordHint(`${match.word} found! this whole word search is blooming. ✦`);
      } else setWordHint(`${match.word} found! keep going.`);
    } else if (match) setWordHint(`${match.word} is already glowing.`);
    else setWordHint("not that one — try one that reads clearly left to right.");
  };
  const chooseGifName = (id: string) => {
    if (matchedGifItems.includes(id)) return;
    setSelectedGifName(id);
    setGifNote("now tap the matching GIF on the right.");
  };
  const chooseGif = (id: string) => {
    if (!selectedGifName || matchedGifItems.includes(id)) {
      if (!selectedGifName) setGifNote("start by choosing a name on the left.");
      return;
    }
    if (selectedGifName === id) {
      const nextMatches = [...matchedGifItems, id];
      setMatchedGifItems(nextMatches);
      setSelectedGifName(null);
      setGifNote(nextMatches.length === gifMatchItems.length ? "every category connected — your whole little universe is glowing!" : "that line is a match! choose another name.");
    } else {
      setSelectedGifName(null);
      setGifNote("not that GIF — no worries, try another connection.");
    }
  };

  const selectedMatchingCategory = matchingCategories.find(({ id }) => id === matchingCategoryId) ?? matchingCategories[0];
  const selectedWordCategory = wordSearchCategories.find(({ id }) => id === wordCategoryId) ?? wordSearchCategories[0];
  const currentWordSearch = buildWordSearch(selectedWordCategory);
  const foundWordCells = currentWordSearch.words.filter(({ word }) => foundWords.includes(word)).flatMap(({ path }) => path);
  const matchedPairCount = matchedMatchCards.length / 2;
  const cardGameComplete = matchingCompletedCategories.length === matchingCategories.length;
  const wordGameComplete = completedWordCategories.length === wordSearchCategories.length;
  const gifGameComplete = matchedGifItems.length === gifMatchItems.length;

  return (
    <main className="night-world">
      <FallingPetals />
      <div className="corner-name">raedah&apos;s night garden <span>✦</span></div>
      <section className="tree-stage" aria-label="Raedah's cherry blossom tree">
        <div className="stage-copy"><p>hey raedah</p><h1>i made you<br />a whole night.</h1><span>touch the glowing parts of the tree.</span></div>
        <div className="tree-whisper">there are seven little things hiding in the blossoms ↓</div>
        <button className="tree-spot spot-letter" onClick={() => setActiveScene("letter")} aria-label="Open the first letter"><i>♡</i><span>a note i&apos;ve been saving</span></button>
        <button className="tree-spot spot-midnight" onClick={() => setActiveScene("midnight")} aria-label="Open the late-night letter"><i>☾</i><span>open this at 2am</span></button>
        <button className="tree-spot spot-game" onClick={() => setActiveScene("game")} aria-label="Play petal catch"><i>✿</i><span>catch the petals</span></button>
        <button className="tree-spot spot-matching" onClick={() => setActiveScene("matching")} aria-label="Play the card matching game"><i>♢</i><span>card matching games</span></button>
        <button className="tree-spot spot-favorites" onClick={() => setActiveScene("favorites")} aria-label="Open favorite things"><i>★</i><span>your favorite things</span></button>
        <button className="tree-spot spot-wordsearch" onClick={() => setActiveScene("wordsearch")} aria-label="Open word searches"><i>⚔</i><span>seven word searches</span></button>
        <button className="tree-spot spot-gifmatch" onClick={() => setActiveScene("gifmatch")} aria-label="Play the GIF matching game"><i>✦</i><span>connect names to GIFs</span></button>
      </section>

      <aside className="lofi-radio" aria-label="Lo-fi track selector">
        <div className="radio-top"><span className={trackId ? "live-dot" : "quiet-dot"} /> <b>little night radio</b>{trackId && <button onClick={stopMusic}>pause</button>}</div>
        <p>{trackId ? `now looping · ${tracks.find((track) => track.id === trackId)?.name}` : "pick a track once and let it stay with you."}</p>
        <div className="track-list">{tracks.map((track, index) => <button key={track.id} className={trackId === track.id ? "selected" : ""} onClick={() => playTrack(track.id)}><em>0{index + 1}</em><span><b>{track.name}</b><small>{track.mood}</small></span><i>{trackId === track.id ? "Ⅱ" : "▶"}</i></button>)}</div>
      </aside>

      {activeScene && <div className="scene-overlay" role="dialog" aria-modal="true" aria-label="Raedah's activity"><button className="close-scene" onClick={closeScene} aria-label="Close activity">close ×</button><FallingPetals count={18} />
        {activeScene === "letter" && <section className="heart-letter"><p className="letter-kicker">for you, always</p><h2>raedah,</h2><p>you&apos;re my cousin on paper, but that has never been the real story. you&apos;re my sister in the way we grew up together, in the way i&apos;d pick you in every room, in the way some of my favorite memories only make sense because you&apos;re in them.</p><p>i hope you know that you do not have to be extra anything to be loved big. you are already funny, warm, easy to miss, impossible to replace, and entirely your own kind of special. the world gets a little softer when you&apos;re around. i mean that.</p><p>so this is your tiny reminder: i&apos;m always rooting for you. on your best days, on the days you feel weird, and on the days you just want somebody to sit there with you and say “yeah, that was a lot.” i&apos;ve got you. no matter what.</p><p className="letter-sign">love you forever, your cousin-sister ♡</p></section>}
        {activeScene === "midnight" && <section className="heart-letter midnight-letter"><p className="letter-kicker">opened after the world gets quiet</p><h2>if it&apos;s late, read this slower.</h2><p>you&apos;re allowed to put the whole day down for a second. you don&apos;t have to solve tomorrow tonight. you can just breathe, put on a soft song, drink some water, and remember that you are doing better than your brain is letting you believe.</p><p>there is still so much sweetness ahead of you: silly conversations, pretty skies, songs that make you stop walking, lilies in a shop window, and all the random little moments that turn into stories later. stay for all of it, okay?</p><p>and if you need a sign from the universe: this is it. you are loved. you are wanted here. now go get cozy, or text me something dumb. both are valid.</p><p className="letter-sign">ps. zoro would still get lost finding this note. ♡</p></section>}
        {activeScene === "game" && <section className="petal-game-night"><div><p className="letter-kicker">tiny game, zero pressure</p><h2>catch the petals before they disappear.</h2><p>you found <b>{caught.length}</b> out of {PETAL_COUNT}. every one has a secret little wish in it.</p></div><div className="petal-field">{Array.from({ length: PETAL_COUNT }, (_, index) => <button key={index} onClick={() => catchPetal(index)} className={`night-petal night-petal-${index} ${caught.includes(index) ? "found" : ""}`} aria-label={`Catch petal ${index + 1}`}>{caught.includes(index) ? "✦" : "✿"}</button>)}{caught.length === PETAL_COUNT && <Fireworks />}</div><div className="petal-wish">{caught.length === PETAL_COUNT ? "you did it — the whole garden is celebrating you. ✦" : petalWish}</div><div className="game-line">{caught.length === PETAL_COUNT ? "you got every single one. officially blossom royalty." : "tap the little pink petals floating around."}<button onClick={() => { setCaught([]); setPetalWish("new round, new little wishes."); }}>start over</button></div></section>}
        {activeScene === "favorites" && <section className="favorite-dream"><div className="favorite-copy"><p className="letter-kicker">your little corner of the tree</p><h2>the things that make you smile.</h2><p>lilies forever. mint anything. Zoro and the straw hats. Stray Kids on max volume. Monica, Joey, Chandler. some Avengers. Zenitsu being Zenitsu. Eren staring dramatically. Bruno Mars. Mark Ruffalo. all of it.</p><p className="favorite-foot">the correct amount of lilies is: yes.</p><div className="chaos-wall"><p>{wallLine}</p><div className="reaction-row">{["☕ Friends", "🎤 Bruno", "⚡ Zenitsu", "💚 Avengers", "🕺 SKZ"].map((label, index) => <button key={label} onClick={() => setWallLine(chaosLines[index])}>{label}</button>)}</div><div className="wall-games"><button onClick={() => setZoroDirection(zoroDirections[Math.floor(Math.random() * zoroDirections.length)])}><b>zoro&apos;s directions</b><span>{zoroDirection}</span></button><button onClick={() => { setLilyCount((count) => count + 1); setWallLine(lilyCount + 1 === 10 ? "TEN LILIES. the garden has officially adopted you." : `lily tap #${lilyCount + 1} — correct response.`); }}><b>tap the lily</b><span>lilies collected: {lilyCount} ⚜</span></button></div></div></div><div className="gif-cloud">{fanGifs.map((gif, index) => <a href={gif.href} target="_blank" rel="noreferrer" className={`gif-sticker sticker-${index + 1}`} key={gif.label}><img src={gif.src} alt={`${gif.label} animated sticker`} /><span>{gif.label}</span></a>)}<i className="lily doodle-one">⚜</i><i className="lily doodle-two">⚜</i><i className="tiny-star">✦</i></div></section>}
        {activeScene === "matching" && <section className="matching-room"><div className="word-game-intro"><p className="letter-kicker">six little memory worlds</p><h2>match what she loves.</h2><p>Each category has 30 pairs. Six missed turns resets only the deck you&apos;re currently playing.</p></div><div className="matching-categories" role="group" aria-label="Card matching categories">{matchingCategories.map((category) => <button key={category.id} onClick={() => startMatchingGame(category.id)} className={matchingCategoryId === category.id ? "selected" : ""} aria-pressed={matchingCategoryId === category.id}><i>{category.icon}</i><span>{category.label}</span><small>{matchingCompletedCategories.includes(category.id) ? "complete ✦" : "30 pairs"}</small></button>)}</div><div className="matching-status"><span>{selectedMatchingCategory.icon} {selectedMatchingCategory.label}</span><b>{matchedPairCount}/30 pairs</b><em>{matchingTurns} turns</em><em>{matchingMistakes}/6 mistakes</em><button onClick={() => startMatchingGame()}>shuffle again</button></div><p className="matching-note" aria-live="polite">{matchingNote}</p><div className="memory-board" aria-label={`${selectedMatchingCategory.label} matching board`}>{matchingDeck.map((card) => { const revealed = flippedMatchCards.includes(card.id) || matchedMatchCards.includes(card.id); const matched = matchedMatchCards.includes(card.id); return <button key={card.id} onClick={() => chooseMatchCard(card)} className={`memory-card ${revealed ? "revealed" : ""} ${matched ? "matched" : ""}`} aria-label={revealed ? card.label : "Hidden matching card"} disabled={matched || checkingMatch}><span className="memory-card-back">{selectedMatchingCategory.icon}</span><span className="memory-card-face">{card.label}</span></button>; })}</div><p className="game-progress">categories completed: {matchingCompletedCategories.length}/{matchingCategories.length}</p>{cardGameComplete && <GameFinish title="you completed every memory world." copy="A lily for you, a whole firework sky, and proof that you are the main character of this garden." />}</section>}
        {activeScene === "wordsearch" && <section className="word-search-room big-word-search"><div className="word-game-intro"><p className="letter-kicker">seven huge word hunts</p><h2>find every favorite.</h2><p>{wordHint}</p></div><div className="word-search-categories" role="group" aria-label="Word search categories">{wordSearchCategories.map((category) => <button key={category.id} onClick={() => startWordSearch(category.id)} className={wordCategoryId === category.id ? "selected" : ""} aria-pressed={wordCategoryId === category.id}><i>{category.icon}</i><span>{category.label}</span><small>{completedWordCategories.includes(category.id) ? "complete ✦" : "15 × 15"}</small></button>)}</div><div className="word-search-layout"><div className="word-grid huge-word-grid" aria-label={`${selectedWordCategory.label} word search`}>{currentWordSearch.grid.map((letter, index) => <button key={index} onClick={() => chooseWordCell(index, currentWordSearch.words)} className={`word-cell ${wordStart === index ? "start" : ""} ${foundWordCells.includes(index) ? "found" : ""}`} aria-label={`Letter ${letter}`}>{letter}</button>)}</div><div className="word-list"><span>{selectedWordCategory.icon} find these:</span>{currentWordSearch.words.map(({ word }) => <b className={foundWords.includes(word) ? "solved" : ""} key={word}>{foundWords.includes(word) ? "✦" : "○"} {word}</b>)}<button onClick={() => startWordSearch(wordCategoryId)}>restart this hunt</button></div></div><p className="game-progress">word searches completed: {completedWordCategories.length}/{wordSearchCategories.length}</p>{wordGameComplete && <GameFinish title="you found every hidden word." copy="The final surprise is a whole night garden cheering for you — you finished all seven." />}</section>}
        {activeScene === "gifmatch" && <section className="gif-match-room"><div className="word-game-intro"><p className="letter-kicker">a little connection game</p><h2>match the name to the GIF.</h2><p>{gifNote}</p></div><div className="gif-match-board"><svg className="gif-connection-lines" viewBox="0 0 100 600" preserveAspectRatio="none" aria-hidden="true">{matchedGifItems.map((id) => { const nameIndex = gifMatchItems.findIndex((item) => item.id === id); const gifIndex = gifOrder.indexOf(id); return <line key={id} x1="32" y1={`${nameIndex * 100 + 50}`} x2="68" y2={`${gifIndex * 100 + 50}`} />; })}</svg><div className="gif-match-names">{gifMatchItems.map((item, index) => <button key={item.id} onClick={() => chooseGifName(item.id)} className={`${selectedGifName === item.id ? "selected" : ""} ${matchedGifItems.includes(item.id) ? "matched" : ""}`} disabled={matchedGifItems.includes(item.id)}><small>{index + 1}. {item.category}</small><b>{item.name}</b></button>)}</div><div className="gif-match-gifs">{gifOrder.map((id) => { const item = gifMatchItems.find((entry) => entry.id === id)!; return <button key={id} onClick={() => chooseGif(id)} className={matchedGifItems.includes(id) ? "matched" : ""} disabled={matchedGifItems.includes(id)} aria-label={`Choose the GIF for ${item.category}`}><img src={item.src} alt={`${item.category} animated GIF`} /><span>{matchedGifItems.includes(id) ? "connected ✦" : "tap this GIF"}</span></button>; })}</div></div><p className="game-progress">connections complete: {matchedGifItems.length}/{gifMatchItems.length}</p>{gifGameComplete && <GameFinish title="every world is connected." copy="Here is your lily, your firework sky, and one giant reminder that you are loved." />}</section>}
      </div>}
      <footer>built for the best cousin-sister • keep the night soft</footer>
    </main>
  );
}

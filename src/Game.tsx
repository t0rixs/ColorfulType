import Word_Data from "../public/assets/words.json";
import convertRomajiToHiragana, { processBufferIncrementally } from "./converthiragana";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import getContrastColor from "./textcolor";
interface Word {
    name: string;
    ruby: string;
    code: string;
}

export default function Game() {
    const wordList: Word[] = Word_Data;
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [timerCount, setTimerCount] = useState(60);
    const [inputCorrect, setInputCorrect] = useState(false);
    const [romajiInput, setRomajiInput] = useState(""); // ローマ字入力バッファ
    const [convertedHiragana, setConvertedHiragana] = useState(""); // 変換済みのひらがな
    const [socre, setScore] = useState(0);
    const [reset, setReset] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const usedWordIndicesRef = useRef<Set<number>>(new Set());
    const noSoundRef = useRef<HTMLAudioElement | null>(null);
    const convertedHiraganaRef = useRef<string>(""); // 最新の変換済みひらがなを保持
    const navigate = useNavigate();
    // 使用済みでない単語からランダムに選択
    const getRandomUnusedWord = (): Word | null => {
        const unusedIndices = wordList
            .map((_, index) => index)
            .filter(index => !usedWordIndicesRef.current.has(index));

        if (unusedIndices.length === 0) {
            // すべての単語を使い切った場合はnullを返す
            return null;
        }

        const randomIndex = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
        usedWordIndicesRef.current.add(randomIndex);
        return wordList[randomIndex];
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimerCount(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        if (timer <= 0) {
            setGameOver(true);
        }
        return () => clearInterval(timer);
    }, [reset]);

    // サイト全域でキーボード入力をリッスン
    useEffect(() => {
        if (!currentWord) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // input要素やtextarea要素にフォーカスがある場合は無視
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                return;
            }

            // 英字のみを受け付ける
            if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
                const newBuffer = romajiInput + e.key.toLowerCase();
                const currentConverted = convertedHiraganaRef.current;


                // バッファを逐次的に処理
                const result = processBufferIncrementally(newBuffer, currentWord.ruby, currentConverted);

                if (result.isValid && timerCount > 0) {
                    // 有効な入力の場合、変換済み部分とバッファを更新
                    setRomajiInput(result.remainingBuffer);
                    setConvertedHiragana(result.newConverted);
                    convertedHiraganaRef.current = result.newConverted;
                } else {
                    // 無効な入力の場合、音を鳴らす
                    if (noSoundRef.current && timerCount > 0) {
                        noSoundRef.current.currentTime = 0;
                        noSoundRef.current.play().catch(err => {
                            console.log('音声再生エラー:', err);
                        });
                    }
                }
            } else if (e.key === 'Enter') {
                setReset(prev => prev + 1);
            } else if (e.key === 'Backspace') {
                navigate('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentWord, romajiInput]);

    // 入力が正解かチェック
    useEffect(() => {
        if (!currentWord) return;
        // 変換済みのひらがなとバッファの残りを合わせてチェック
        const finalConverted = convertedHiragana + convertRomajiToHiragana(romajiInput);
        if (finalConverted === currentWord.ruby.trim()) {
            setInputCorrect(true);
        }
    }, [romajiInput, convertedHiragana, currentWord]);

    useEffect(() => {
        if (inputCorrect) {
            const nextWord = getRandomUnusedWord();
            setCurrentWord(nextWord);
            setRomajiInput("");
            setConvertedHiragana("");
            convertedHiraganaRef.current = "";
            setInputCorrect(false);
            setScore(prev => prev + 1);
        }
    }, [inputCorrect]);

    // 音声ファイルの初期化
    useEffect(() => {
        noSoundRef.current = new Audio('/assets/no.mp3');
    }, []);

    //初期設定関数
    useEffect(() => {
        usedWordIndicesRef.current = new Set(); // リセット
        const initialWord = getRandomUnusedWord();
        setCurrentWord(initialWord);
        setRomajiInput("");
        setConvertedHiragana("");
        convertedHiraganaRef.current = "";
        setTimerCount(60);
        setScore(0);
        setGameOver(false);
    }, [reset]);

    const searchParams = useSearchParams();
    const isRuby = searchParams[0]?.get('isRuby') === 'true';

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: currentWord?.code,
                    maxHeight: '100vh',
                    minWidth: '100vw',
                    minHeight: '100vh',
                    margin: 0,
                    padding: 0,
                    position: 'relative',
                    zIndex: 1,
                }}
                tabIndex={0}
            >
                {isRuby && <p style={{
                    fontSize: '32px',
                    marginBottom: '20px',
                    padding: '10px',
                    color: 'black',
                    backgroundColor: 'white',
                }}>{currentWord?.name}</p>}
                <p style={{
                    fontSize: '20px',
                    marginBottom: '20px',
                    color: getContrastColor(currentWord?.code || '#000000'),

                }}>残り時間: {timerCount}秒</p>
                <div style={{ marginTop: '40px' }}>
                    <p style={{
                        fontSize: '28px',
                        minHeight: '40px',
                        letterSpacing: '0.1em',
                        color: getContrastColor(currentWord?.code || '#000000'),
                    }}>
                        {convertedHiragana + romajiInput}
                    </p>
                </div>
                <p style={{
                    fontSize: '24px',
                    marginTop: '20px',
                    color: getContrastColor(currentWord?.code || '#000000'),
                }}>スコア: {socre}</p>
            </div>
            {gameOver && <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vh',
                height: '60vh',
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                zIndex: 2,
            }}>
                <h1 style={{
                    fontSize: '48px',
                    color: 'black',
                }}>Game Over</h1>
                <p style={{
                    fontSize: '24px',
                    color: 'black',
                }}>スコア: {socre}</p>
                <button onClick={() => navigate('/')} style={{
                    padding: '10px 20px',
                    fontSize: '18px',
                    backgroundColor: '#0095d9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                }}>Back to Menu</button>
                <button onClick={() => setReset(prev => prev + 1)} style={{
                    padding: '10px 20px',
                    fontSize: '18px',
                    backgroundColor: '#0095d9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                }}>Restart</button>
            </div>}
        </>
    )
}
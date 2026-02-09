import Word_Data from "../public/assets/words.json";
import convertRomajiToHiragana, { processBufferIncrementally } from "./converthiragana";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import getContrastColor from "./textcolor";
import { FaSquareXTwitter } from "react-icons/fa6";
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
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
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
            } else if (e.key === 'Escape') {
                setReset(prev => prev + 1);
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
        noSoundRef.current = new Audio(`${import.meta.env.BASE_URL}assets/no.mp3`);
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
    const isName = searchParams[0]?.get('isName') === 'true';

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
                    alignContent: 'center',

                }}
                tabIndex={0}
            >
                <p style={{
                    fontSize: '32px',
                    marginBottom: '20px',
                    padding: '10px',
                    color: 'black',
                    backgroundColor: 'white',
                }}>{isName ? currentWord?.name : currentWord?.code}</p>

            </div >
            {/* 左上に表示 */}
            < div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 2,
                padding: '10px',
            }}>
                <p style={{
                    fontSize: '20px',
                    color: getContrastColor(currentWord?.code || '#000000'),
                }}>残り時間: {timerCount}秒</p>
                <p style={{
                    fontSize: '20px',
                    color: getContrastColor(currentWord?.code || '#000000'),
                }}>スコア: {socre}</p>
            </div >
            {/* 中央に表示 */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                color: getContrastColor(currentWord?.code || '#000000'),
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
            }}>
                <span>{convertedHiragana + romajiInput}</span>
                <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '24px',
                    backgroundColor: getContrastColor(currentWord?.code || '#000000'),
                    marginLeft: '2px',
                    animation: 'blink 1s infinite',
                }}></span>
            </div>
            <style>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `}</style>

            {/* 下部に表示 */}
            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '16px',
                color: '#888888',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Link to="/" style={{
                    fontSize: '16px',
                    color: '#888888',
                    textDecoration: 'none',
                    marginBottom: '5px',
                }}>Menuに戻る</Link>
                <Link to="/" style={{
                    fontSize: '16px',
                    color: '#888888',
                    textDecoration: 'none',
                }}>Escape to Restart</Link>
            </div>
            {gameOver && (
                <>
                    {/* 背景をぼかすオーバーレイ */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 999,
                    }} />
                    {/* ゲームオーバーモーダル */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '500px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '40px 30px',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '30px',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <h1 style={{
                                fontSize: '32px',
                                color: 'black',
                                margin: 0,
                                fontWeight: 'normal',
                            }}>Game Over</h1>
                            <p style={{
                                fontSize: '20px',
                                color: 'black',
                                margin: 0,
                            }}>スコア: {socre}</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                        }}>
                            <button onClick={() => setReset(prev => prev + 1)} style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#0095d9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                                transition: 'opacity 0.2s',
                            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                Restart
                            </button>
                            <button onClick={() => {
                                const shareText = '色を当てるタイピングゲーム「Colorful Type」で ' + socre + ' 点を取りました！ https://t0rixs.github.io/ColorfulType/  ';
                                const hashtags = ['ColorfulTyping', 'タイピングゲーム'];

                                // XのシェアURLを構築
                                const params = new URLSearchParams();
                                params.set('text', shareText);
                                if (hashtags.length) params.set('hashtags', hashtags.join(','));

                                const tweetUrl = `https://x.com/intent/tweet?${params.toString()}`;
                                window.open(tweetUrl, '_blank', 'noopener,noreferrer');
                            }} style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#0095d9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'opacity 0.2s',
                            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'} type="button" aria-label="Share on X">
                                <FaSquareXTwitter /> Share on X
                            </button>
                            <button onClick={() => navigate('/')} style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: 'transparent',
                                color: '#888888',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                transition: 'opacity 0.2s',
                            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                                Menuに戻る
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
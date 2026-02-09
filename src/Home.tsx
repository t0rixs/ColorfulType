import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Word_Data from "../public/assets/words.json";
import './slider.css';
import getContrastColor from "./textcolor";
export default function Home() {
    const navigate = useNavigate();
    const [isName, setIsName] = useState(true);
    const [bcolor, setBcolor] = useState('');
    const [swichColor, setSwichColor] = useState('#0095d9');
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                navigate(`/game?isName=${isName}`);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [isName]);

    useEffect(() => {
        const getRandomColor = (): string => {
            const randomColor = Word_Data[Math.floor(Math.random() * Word_Data.length)].code;
            return randomColor;
        };
        const randomColor = getRandomColor();
        setBcolor(randomColor);
    }, [isName]);
    useEffect(() => {
        const getRandomColor = (): string => {
            const randomColor = Word_Data[Math.floor(Math.random() * Word_Data.length)].code;
            return randomColor;
        };
        const randomColor = getRandomColor();
        setSwichColor(randomColor);
    }, [isName]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: bcolor }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px', color: getContrastColor(bcolor) }}>Colorful Type</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setIsName(true)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '18px',
                        backgroundColor: isName ? swichColor : '#e0e0e0',
                        color: isName ? getContrastColor(swichColor) : '#666',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    色名を表示
                </button>
                <button
                    onClick={() => setIsName(false)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '18px',
                        backgroundColor: !isName ? swichColor : '#e0e0e0',
                        color: !isName ? getContrastColor(swichColor) : '#666',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    カラーコードを表示
                </button>
            </div>
            <Link to={`/game?isName=${isName}`} style={{ fontSize: '24px', padding: '10px 20px', backgroundColor: swichColor, color: getContrastColor(swichColor), borderRadius: '5px', textDecoration: 'none' }}>Enter to Start</Link>
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                <p style={{ fontSize: '16px', color: '#888888', marginTop: '20px' }}>Copyright © 2026 宮野柊太 All rights reserved.</p>
            </div>
        </div>
    )
}
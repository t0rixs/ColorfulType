import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './slider.css';
export default function Home() {
    const navigate = useNavigate();
    const [isRuby, setIsRuby] = useState(true);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                navigate(`/game?isRuby=${isRuby}`);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRuby]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Color Typing</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setIsRuby(true)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '18px',
                        backgroundColor: isRuby ? '#0095d9' : '#e0e0e0',
                        color: isRuby ? 'white' : '#666',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    色名を表示する
                </button>
                <button
                    onClick={() => setIsRuby(false)}
                    style={{
                        padding: '10px 20px',
                        fontSize: '18px',
                        backgroundColor: !isRuby ? '#0095d9' : '#e0e0e0',
                        color: !isRuby ? 'white' : '#666',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    色名を表示しない
                </button>
            </div>
            <Link to={`/game?isRuby=${isRuby}`} style={{ fontSize: '24px', padding: '10px 20px', backgroundColor: '#0095d9', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>Enter to Start</Link>
        </div>
    )
}
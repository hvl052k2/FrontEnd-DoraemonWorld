import { useRef, useState, useEffect } from "react";
import CharacterCard from "../../components/CharacterCard";
import { Button, message, Tag } from 'antd'; // Thêm Tag cho sinh động
import { LogOut, Sparkles, Heart } from 'lucide-react';
import { getCharacters } from "../../services/handleAPIData";

const App = ({ onLogout }) => {
    const audioRef = useRef(null);
    const [activeId, setActiveId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCharacters = async () => {
        try {
            const data = await getCharacters.getAll();
            setCharacters(data);
        } catch (error) {
            message.error("Không thể kết nối với túi thần kỳ (Backend)!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    useEffect(() => {
        const session = localStorage.getItem('isLoggedIn');
        if (session === 'true') setIsLoggedIn(true);
    }, []);

    const clouds = Array.from({ length: 15 }).map((_, i) => {
        // Ngẫu nhiên hóa loại mây: 0 (xa), 1 (vừa), 2 (gần)
        const depth = Math.floor(Math.random() * 3);

        const settings = [
            { size: 0.4, opacity: 0.3, speed: '40s', zIndex: 1, blur: '4px' }, // Xa (Nhỏ, mờ, chậm, nhòe)
            { size: 0.8, opacity: 0.6, speed: '25s', zIndex: 2, blur: '2px' }, // Vừa
            { size: 1.5, opacity: 0.9, speed: '15s', zIndex: 3, blur: '0px' }, // Gần (To, rõ, nhanh)
        ][depth];

        return {
            id: i,
            top: `${Math.random() * 90}%`,
            delay: `${Math.random() * -40}s`,
            ...settings
        };
    });

    const handlePlaySound = (id, src) => {
        if (!src) {
            message.error('Nhân vật này chưa có âm thanh!');
            return;
        };
        if (activeId === id && audioRef.current) {
            audioRef.current.pause();
            setActiveId(null);
            return;
        }
        if (audioRef.current) audioRef.current.pause();
        setActiveId(id);
        audioRef.current = new Audio(src);
        audioRef.current.play();
        audioRef.current.onended = () => setActiveId(null);
    };

    return (
        <div className="min-h-screen bg-[#e3f2fd] font-sans relative overflow-x-hidden">

            {/* BẦU TRỜI ĐA TẦNG */}
            <div className="absolute inset-0 pointer-events-none">
                {clouds.map((cloud) => (
                    <div
                        key={cloud.id}
                        className="absolute left-0 animate-cloud"
                        style={{
                            top: cloud.top,
                            animationDuration: cloud.speed,
                            animationDelay: cloud.delay,
                            zIndex: cloud.zIndex,
                            transform: `scale(${cloud.size})`,
                            opacity: cloud.opacity,
                            filter: `blur(${cloud.blur}) drop-shadow(0 4px 6px rgba(255,255,255,0.5))`,
                        }}
                    >
                        {/* Cấu trúc mây 4 khối tròn */}
                        <div className="relative w-24 h-9 bg-white rounded-full">
                            {/* Khối vòm 1 (Trái) */}
                            <div className="absolute w-12 h-12 bg-white rounded-full -top-5 left-2"></div>
                            {/* Khối vòm 2 (Giữa - To nhất) */}
                            <div className="absolute w-16 h-16 bg-white rounded-full -top-8 left-8"></div>
                            {/* Khối vòm 3 (Phải) */}
                            <div className="absolute w-12 h-12 bg-white rounded-full -top-4 left-16"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Header: Thiết kế dạng cong mềm mại */}
            <header className="bg-[#0091ea] text-white py-8 px-6 md:px-20 flex justify-between items-center shadow-[0_4px_20px_rgba(0,145,234,0.4)] rounded-b-[40px] relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-full shadow-inner">
                        <Sparkles className="text-[#ffd600]" size={28} fill="#ffd600" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-wide uppercase">
                            Thế Giới <span className="text-[#ffd600]">Doraemon</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                            <p className="text-xs md:text-sm font-medium opacity-90">Sẵn sàng cho chuyến phiêu lưu!</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onLogout}
                    className="h-11 px-6 rounded-full border-none bg-[#ff5252] text-white font-bold shadow-[0_4px_15px_rgba(255,82,82,0.4)] hover:bg-[#ff1744] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-black tracking-wider">ĐĂNG XUẤT</span>
                </Button>
            </header>

            {/* Main Content */}
            <main className="max-w-275 mx-auto my-12 px-6 relative z-10">
                <div className="text-center mb-10">
                    <Tag color="blue" className="rounded-full px-4 py-1 text-sm font-semibold border-none bg-white text-[#0091ea] shadow-sm">
                        NHÂN VẬT CHÍNH
                    </Tag>
                    <h2 className="text-gray-500 mt-4 font-medium italic">"Bấm vào nút loa để nghe giọng nói nhân vật"</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? <div className="text-center mt-20">Đang mở túi thần kỳ...</div> :
                        characters.map((char) => (
                            <CharacterCard
                                key={char.id}
                                name={char.name}
                                image={char.image}
                                description={char.description}
                                isActive={activeId === char.id}
                                onPlay={() => handlePlaySound(char.id, char.audio_src)}
                            />
                        ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-12 text-[#0091ea] font-medium">
                <div className="flex justify-center items-center gap-2 opacity-60">
                    <span>&copy; 2026 Fanpage Doraemon</span>
                    <Heart size={14} fill="#ff5252" className="text-[#ff5252]" />
                    <span>Made for Hà Linh</span>
                </div>
                <div className="mt-2 w-20 h-1 bg-[#ffd600] mx-auto rounded-full"></div>
            </footer>
        </div>
    );
}

export default App;
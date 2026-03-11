import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import axios from "axios";

const BACKEND_URL = "http://localhost/BackEndDoraemonWorld";

const ChatWindow = ({ character, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await axios.post(`${BACKEND_URL}/chat.php`, {
                character_id: character.id,
                message: input
            });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (e) {
            message.error("Mất kết nối với thế kỷ 22!");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <Modal title={`Đang chat với ${character.name}`} open={true} onCancel={onClose} footer={null}>
            <div className="h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4 flex flex-col gap-3">
                {messages.map((m, i) => (
                    <div key={i} className={`max-w-[80%] p-3 rounded-2xl ${
                        m.role === 'user' ? 'bg-[#0091ea] text-white self-end' : 'bg-white text-gray-800 self-start shadow-sm'
                    }`}>
                        {m.text}
                    </div>
                ))}
                {isTyping && <div className="text-xs text-gray-400 animate-pulse">Đang gõ...</div>}
            </div>
            <div className="flex gap-2">
                <Input value={input} onChange={e => setInput(e.target.value)} onPressEnter={sendMessage} placeholder="Nhập tin nhắn..." />
                <Button type="primary" onClick={sendMessage}>Gửi</Button>
            </div>
        </Modal>
    );
};

export default ChatWindow;
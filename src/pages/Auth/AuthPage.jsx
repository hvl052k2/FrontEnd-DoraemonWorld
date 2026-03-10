// src/pages/AuthPage.jsx
import { useState, useMemo } from 'react'; // Thêm useMemo để mây không bị giật
import { Card, Input, Button, Form, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined, RocketOutlined } from '@ant-design/icons';
import { authService } from '../../services/handleAPIData'; // <--- ĐẢM BẢO ĐÃ IMPORT SERVICE

const { Title, Text } = Typography;

const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false); // <--- Trạng thái chờ API

    // Tối ưu mây trôi bằng useMemo để không render lại lãng phí
    const clouds = useMemo(() => Array.from({ length: 15 }).map((_, i) => {
        const depth = Math.floor(Math.random() * 3);
        const settings = [
            { size: 0.4, opacity: 0.3, speed: '40s', zIndex: 1, blur: '4px' },
            { size: 0.8, opacity: 0.6, speed: '25s', zIndex: 2, blur: '2px' },
            { size: 1.5, opacity: 0.9, speed: '15s', zIndex: 3, blur: '0px' },
        ][depth];

        return {
            id: i,
            top: `${Math.random() * 90}%`,
            delay: `${Math.random() * -40}s`,
            ...settings
        };
    }), []);

    // --- LOGIC XỬ LÝ CHÍNH ---
    const onFinish = async (values) => {
        setLoading(true); // Bắt đầu đợi
        try {
            if (!isLogin) {
                // GỌI API ĐĂNG KÝ
                const result = await authService.register(values.username, values.password);
                if (result.success) {
                    message.success('Đăng ký thành công! Hãy dùng bảo bối để đăng nhập.');
                    setIsLogin(true);
                } else {
                    message.error(result.message || 'Tên đăng nhập đã tồn tại!');
                }
            } else {
                // GỌI API ĐĂNG NHẬP
                const result = await authService.login(values.username, values.password);
                if (result.success) {
                    message.success('Chào mừng bạn đến với Thế giới Doraemon!');
                    // Lưu trạng thái đăng nhập vào localStorage để giữ phiên làm việc
                    localStorage.setItem('isLoggedIn', 'true');
                    onLoginSuccess();
                } else {
                    message.error(result.message || 'Sai tài khoản hoặc mật khẩu!');
                }
            }
        } catch (error) {
            console.error("Lỗi API:", error);
            message.error('Mạng có vấn đề rồi, Nobita ơi!');
        } finally {
            setLoading(false); // Kết thúc đợi
        }
    };

    return (
        <div className="min-h-screen bg-[#e3f2fd] flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* BẦU TRỜI ĐA TẦNG (Giữ nguyên phần render mây cũ của bạn) */}
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
                        <div className="relative w-24 h-9 bg-white rounded-full">
                            <div className="absolute w-12 h-12 bg-white rounded-full -top-5 left-2"></div>
                            <div className="absolute w-16 h-16 bg-white rounded-full -top-8 left-8"></div>
                            <div className="absolute w-12 h-12 bg-white rounded-full -top-4 left-16"></div>
                        </div>
                    </div>
                ))}
            </div>

            <Card
                className="w-full z-50 max-w-105 shadow-[0_20px_50px_rgba(0,145,234,0.3)] rounded-[30px] border-4 border-white relative"
                style={{ background: 'rgba(255, 255, 255, 0.9)' }}
            >
                {/* ... (Trang trí vòng cổ & Chuông vàng giữ nguyên) ... */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#ff5252] rounded-full"></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#ffd600] rounded-full border-2 border-[#b8860b] shadow-md flex items-center justify-center">
                    <div className="w-6 h-1 bg-[#b8860b] rounded-full"></div>
                </div>

                <div className="text-center mt-6 mb-8">
                    <img
                        src="/images/doraemon-logo-login.png"
                        alt="Logo"
                        className="w-48 mx-auto drop-shadow-lg hover:scale-110 transition-transform duration-300"
                    />
                    <Title level={2} style={{ color: '#0091ea', margin: '10px 0 0' }} className="font-black">
                        {isLogin ? 'ĐĂNG NHẬP' : 'GIA NHẬP ĐỘI'}
                    </Title>
                    <Text className="text-gray-400 italic">Cùng Nobita phiêu lưu nào!</Text>
                </div>

                <Form onFinish={onFinish} layout="vertical" className="px-2">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Tên bạn là gì nhỉ?' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-[#0091ea]" />}
                            placeholder="Tên đăng nhập"
                            size="large"
                            className="rounded-full"
                            disabled={loading} // Vô hiệu hóa khi đang load
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu bảo mật đâu?' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-[#0091ea]" />}
                            placeholder="Mật khẩu"
                            size="large"
                            className="rounded-full"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading} // <--- Hiệu ứng quay vòng khi bấm
                        icon={isLogin ? <SmileOutlined /> : <RocketOutlined />}
                        className="h-12 rounded-full bg-[#0091ea] hover:bg-[#0077c2] border-none text-lg font-bold shadow-lg"
                    >
                        {isLogin ? 'KHÁM PHÁ NGAY' : 'ĐĂNG KÝ THÀNH VIÊN'}
                    </Button>
                </Form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#0077c2] font-semibold hover:text-[#ff5252] transition-colors cursor-pointer border-none bg-transparent"
                    >
                        {isLogin ? 'Bạn là thành viên mới? Đăng ký tại đây' : 'Đã có túi thần kỳ? Đăng nhập'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;
import { AuthFormCard } from "@/features/auth/components/auth-form-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
    title: "Đăng ký | VietFlood Insight",
};

export default function RegisterPage() {
    return (
        <AuthFormCard
            title="Tạo tài khoản người dùng"
            description="Đăng ký tài khoản citizen để theo dõi cảnh báo lũ lụt và gửi báo cáo nhanh trên mobile app."
            note="Trang này chỉ dành cho đăng ký tài khoản user"
        >
            <RegisterForm />
        </AuthFormCard>
    );
}

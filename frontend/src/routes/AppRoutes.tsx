import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import HiraganaPage from "../pages/HiraganaPage";
import QuizPage from "../pages/QuizPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const AppRoutes = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
                path="/login" 
                element={
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <AuthRoute>
                        <RegisterPage />
                    </AuthRoute>
                } 
            />

            <Route 
                path="/hiragana" 
                element={
                    <ProtectedRoute>
                        <HiraganaPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/quiz" 
                element={
                    <ProtectedRoute>
                        <QuizPage />
                    </ProtectedRoute>
                } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;

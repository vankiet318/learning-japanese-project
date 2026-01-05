import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import HiraganaPage from "../pages/HiraganaPage";
import QuizPage from "../pages/QuizPage";

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hiragana" element={<HiraganaPage />} />
            <Route path="/quiz" element={<QuizPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;

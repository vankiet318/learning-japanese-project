import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ThemeToggle />
                <AppRoutes />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;


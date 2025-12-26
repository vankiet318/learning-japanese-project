import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
    return (
        <ThemeProvider>
            <ThemeToggle />
            <AppRoutes />
        </ThemeProvider>
    );
}

export default App;

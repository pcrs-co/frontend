import React, { 
        createContext, 
        useState, 
        useContext, 
        useEffect } 
    from 'react'

// Create a context for the theme
const ThemeContext = createContext(undefined);

// The ThemeProvider component will wrap around the app and provide the theme
export const ThemeProvider = ({ children }) => {
    // Keep track of the current theme
    const [theme, setTheme] = useState("light");

    // Keep track of whether we have initialized the theme from localStorage
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize the theme from localStorage when the component mounts
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const initialTheme = savedTheme || "light";
        setTheme(initialTheme);
        setIsInitialized(true);
    }, []);

    // Update the theme in localStorage whenever the theme changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("theme", theme);
            if (theme === "dark") {
                // Add the "dark" class to the root element to enable dark mode
                document.documentElement.classList.add("dark");
            } else {
                // Remove the "dark" class to disable dark mode
                document.documentElement.classList.remove("dark");
            }
        }
    }, [theme, isInitialized]);

    // A function to toggle the theme
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // Return the ThemeContext.Provider with the theme and toggleTheme
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// A hook to access the theme from within components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};


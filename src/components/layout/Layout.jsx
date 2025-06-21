import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                {children}
            </div>

            <Footer />
        </div>
    );
}

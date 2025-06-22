import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div>{children}</div>

            <Footer />
        </div>
    );
}

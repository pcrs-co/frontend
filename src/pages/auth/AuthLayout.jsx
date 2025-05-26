import Footer from "../../components/layout/Footer";

export default function AuthLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                {children}
            </div>

            <Footer />
        </div>
    );
}

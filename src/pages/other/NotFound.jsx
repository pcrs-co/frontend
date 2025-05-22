import { useNavigate } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import { ChevronLeftIcon } from "../../assets/icons";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
            ERROR
          </h1>

          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            <span className="link link-hover">Back to Previous Page</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

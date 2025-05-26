import { Link } from "react-router";
import { ChevronUpIcon, ChevronDownIcon } from "../../assets/icons";
import { useState } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [language, setLanguage] = useState("English");

  const handleLanguageChange = (lang) => setLanguage(lang);

  return (
    <>
      <footer className="footer sm:footer-horizontal footer-center p-4">
        <aside className="flex flex-row flex-wrap items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {year} -{" "}
            <Link
              to="/"
              className="link link-hover hover:text-gray-300 dark:hover:text-gray-100"
            >
              PCRS
            </Link>{" "}
            Tanzania
          </p>
          <div className="dropdown dropdown-top dropdown-center">
            <div
              tabIndex={0}
              role="button"
              className=" inline-flex items-center link link-hover m-1 ml-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-100"
            >
              <ChevronUpIcon className="size-4 mt-px" />
              {language}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
            >
              {["English"].map((lang) => (
                <li key={lang}>
                  <a
                    onClick={() => {
                      handleLanguageChange(lang);
                      document.activeElement.blur();
                    }}
                  >
                    {lang}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </footer>
    </>
  );
}

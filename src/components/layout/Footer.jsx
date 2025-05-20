import { Link } from "react-router";

export default function Footer() {
  return (
    <>
      <footer className="footer sm:footer-horizontal">
        <aside>
          <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
            {new Date().getFullYear()} -{" "}
            <Link to="/" className="link link-hover">
              PCRS
            </Link>{" "}
            Tanzania
          </p>
        </aside>
      </footer>
    </>
  );
}

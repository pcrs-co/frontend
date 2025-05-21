import { Link } from "react-router";

export default function Footer() {
  return (
    <>
      <footer className="footer sm:footer-horizontal footer-center p-4">
        <aside>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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

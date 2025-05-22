import { Link } from 'react-router'

export default function Header() {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <Link to='/'>PCRS</Link>
      </div>
    </>
  );
}
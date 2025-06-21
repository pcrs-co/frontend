import { Link } from 'react-router'

export default function Header() {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 ml-2">
          <Link to='/'>
            <img src="/PCRS.svg" alt="PCRS Logo" className="h-5 md:h-7" />
          </Link>
        </div>

        <div className="flex-none space-x-2 ml-2">
          <Link to='/login'>
            <button className="btn btn-sm btn-ghost btn-info">Log In</button>
          </Link>
          <Link to='/signup'>
            <button className="btn btn-sm btn-outline hover:btn-info">Sign Up</button>
          </Link>
        </div>
      </div>
    </>
  );
}
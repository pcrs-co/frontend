import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    // Simulate fetching user login status and profile name
    const token = localStorage.getItem('access_token');
    const isUserLoggedIn = !!token;
    const fetchedProfileName = localStorage.getItem('profile_name') || '';

    setIsLoggedIn(isUserLoggedIn);
    setProfileName(fetchedProfileName);
  }, []);

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 ml-2">
          <Link to='/'>
            <img src="/PCRS.svg" alt="PCRS Logo" className="h-5 md:h-7" />
          </Link>
        </div>

        <div className="flex-none space-x-2 ml-2">
          {isLoggedIn ? (
            <span className="text-sm font-medium">{profileName}</span>
          ) : (
            <>
              <Link to='/login'>
                <button className="btn btn-sm btn-ghost btn-info">Log In</button>
              </Link>
              <Link to='/signup'>
                <button className="btn btn-sm btn-outline hover:btn-info">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

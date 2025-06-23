import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import LoginForm from "../auth/LogInForm";
import SignUpForm from "../auth/SignUpForm";

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
      <div className="navbar bg-base-100">
        <div className="flex-1 ml-2">
          <Link to='/'>
            <img src="/PCRS.svg" alt="PCRS Logo" className="h-5 md:h-7" />
          </Link>
        </div>

        <div className="flex-none ml-2">
          {isLoggedIn ? (
            <span className="text-sm font-medium">{profileName}</span>
          ) : (
            <div className="flex space-x-2">
              <div>
                <button
                  className="btn btn-sm btn-ghost btn-info"
                  onClick={() => document.getElementById('login_modal').showModal()}>
                  Log In
                </button>

                <dialog id="login_modal" className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box">
                    <LoginForm />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button></button>
                  </form>
                </dialog>

              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline hover:btn-info"
                  onClick={() => document.getElementById('signup_modal').showModal()}>
                  Sign Up
                </button>

                <dialog id="signup_modal" className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box">
                    <SignUpForm />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button></button>
                  </form>
                </dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

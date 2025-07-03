import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import LoginForm from "../auth/LogInForm";
import SignUpForm from "../auth/SignUpForm";
import { useAuth } from "../../utils/hooks/useAuth";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1 ml-2">
          <Link to='/' className="w-20">
            <img src="/PCRS.svg" alt="PCRS Logo" className="h-5 md:h-7" />
          </Link>
        </div>

        <div className="flex-none ml-2">
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'A'}&background=random`}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>Logged in as @{user?.username}</span>
                </li>
                <li>
                  <Link to="/profile">Profile</Link> {/* Use Link for internal routes */}
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
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

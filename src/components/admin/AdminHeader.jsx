// src/components/admin/AdminHeader.jsx
import React from 'react';
import { useAuth } from '../../utils/hooks/useAuth'; // Assuming you have this hook
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Example icons

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="navbar bg-base-100 border-b border-base-300 px-4">
            <div className="flex-1">
                {/* Can add breadcrumbs or a search bar here later */}
            </div>
            <div className="flex-none gap-2">
                {/* Theme Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-circle">
                    <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
                    <SunIcon className="swap-on h-5 w-5" />
                    <MoonIcon className="swap-off h-5 w-5" />
                </label>

                {/* User Dropdown */}
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
                            <a href="/profile">Profile</a> {/* Link to a future profile page */}
                        </li>
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
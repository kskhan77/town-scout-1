"use client"; // We need this because of the "isLoggedIn" state toggle
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { NavLink } from '../atoms/NavLink';

export const Header = () => {
  // For now, we use a local state. Later, this will come from your backend.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="flex items-center justify-between px-10 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#002D5B] rounded-full flex items-center justify-center">
            <span className="text-white text-[10px]">TS</span>
        </div>
        <span className="font-bold text-[#002D5B] tracking-tight">TOWN SCOUT</span>
      </div>

      {/* Navigation Molecules */}
      <nav className="hidden md:flex items-center gap-8">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/history">History</NavLink>
      </nav>

      {/* Auth State Switcher */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
             <span className="text-gray-600 text-sm font-medium">Welcome, Scout!</span>
             <div className="w-10 h-10 rounded-full bg-[#00D1FF] border-2 border-white shadow-sm cursor-pointer" />
             <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="text-xs">Logout</Button>
          </div>
        ) : (
          <>
            <Button variant="outline">Login</Button>
            <Button variant="primary" onClick={() => setIsLoggedIn(true)}>Signup</Button>
          </>
        )}
      </div>
    </header>
  );
};
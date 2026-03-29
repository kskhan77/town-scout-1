"use client"; // We need this because of the "isLoggedIn" state toggle
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { NavLink } from '../atoms/NavLink';
import Image from 'next/image';
import { PAGE_SHELL } from '@/lib/pageLayout';


export const Header = () => {
  // For now, we use a local state. Later, this will come from your backend.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 shadow-sm backdrop-blur-md">
      <div className={`${PAGE_SHELL} flex items-center justify-between gap-4 py-3.5 md:py-4`}>
      {/* Logo Area */}
      <div className="flex shrink-0 items-center gap-2">
        
        <Image src="/logo.svg" alt="Town Scout Logo" width={200} height={35} className="" />
      </div>

      {/* Navigation Molecules */}
      <nav className="hidden items-center gap-8 md:flex">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/history">History</NavLink>
      </nav>

      {/* Auth State Switcher */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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
      </div>
    </header>
  );
};
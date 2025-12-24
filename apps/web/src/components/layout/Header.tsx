'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">CURATOR STUDIO</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/strategies"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Strategies
              </Link>
              <Link
                href="/analytics"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

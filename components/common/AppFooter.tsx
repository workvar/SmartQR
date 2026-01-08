'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AppFooterProps {
  isDark: boolean;
}

export function AppFooter({ isDark }: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-16 px-8 ${
      isDark 
        ? 'bg-black border-t border-white/10' 
        : 'bg-[#F5F5F7] border-t border-black/10'
    }`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Branding Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-black'}`}>
                W.
              </div>
            </div>
            <div className={`text-lg font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              QRry Studio. Your QR Code Generator
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Reconnecting with what matters.
              <br />
              Tools for professional QR code generation and design.
            </p>
          </div>

          {/* Products Column */}
          <div>
            <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/create/content"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Mission
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Media Kit
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`text-sm hover:opacity-70 transition-opacity ${
                    isDark ? 'text-white/60' : 'text-black/60'
                  }`}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              © {currentYear} WorkVar Pvt. Ltd. All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-6">
              <Link
                href="#"
                className={`text-sm hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
              >
                Instagram
              </Link>
              <Link
                href="#"
                className={`text-sm hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
              >
                X
              </Link>
              <Link
                href="#"
                className={`text-sm hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
              >
                Facebook
              </Link>
              <Link
                href="#"
                className={`text-sm hover:opacity-70 transition-opacity ${
                  isDark ? 'text-white/60' : 'text-black/60'
                }`}
              >
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

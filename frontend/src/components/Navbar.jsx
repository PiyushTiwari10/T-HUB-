import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaGithub, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
  };

  const navLinkClasses = "text-white font-medium flex items-center gap-2 py-1 transition-colors duration-300 hover:text-[#3498db] relative group";
  const activeNavLinkClasses = "text-[#3498db]";

  const logoutButtonNavbarClasses = "bg-transparent text-white p-0 h-full flex items-center text-base font-normal hover:bg-transparent hover:transform-none hover:shadow-none hover:text-[#3498db] gap-2";

  return (
    <header 
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out shadow-md 
                  ${isScrolled ? 'bg-[#2c3e50]/95 py-2.5 shadow-lg' : 'bg-[#2c3e50] py-4'}`}
    >
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
        <div className="navbar-logo">
          <Link href="/" className="flex items-center text-white text-2xl font-bold no-underline">
            <span className="tracking-wider">T-HUB</span>
            <span className="text-[#3498db] text-3xl ml-0.5">.</span>
          </Link>
        </div>

        <div className="md:hidden text-2xl cursor-pointer text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <nav 
          className={`transition-all duration-300 ease-in-out md:flex md:items-center 
                      ${isMobileMenuOpen 
                        ? 'fixed top-0 right-0 h-full w-3/4 max-w-sm bg-[#2c3e50] shadow-xl p-5 pt-16 flex flex-col items-start' 
                        : 'hidden md:flex'}`}
        >
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-5 right-5 text-white text-2xl md:hidden"
            >
              <FaTimes />
            </button>
          )}
          <ul className="flex flex-col md:flex-row list-none m-0 p-0 md:items-center w-full md:w-auto">
            <li className="my-2.5 md:my-0 md:mx-3 w-full md:w-auto">
              <Link href="/" className={`${navLinkClasses} ${pathname === '/' ? activeNavLinkClasses : ''}`}>
                <FaHome />
                <span>Home</span>
                {pathname === '/' && <span className="absolute bottom-[-5px] left-0 w-full h-[3px] bg-[#3498db] rounded-sm md:block hidden"></span>}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full md:block hidden"></span>
              </Link>
            </li>
            <li className="my-2.5 md:my-0 md:mx-3 w-full md:w-auto">
              <Link href="/about" className={`${navLinkClasses} ${pathname.includes('/about') ? activeNavLinkClasses : ''}`}>
                <FaInfoCircle />
                <span>About</span>
                {pathname.includes('/about') && <span className="absolute bottom-[-5px] left-0 w-full h-[3px] bg-[#3498db] rounded-sm md:block hidden"></span>}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full md:block hidden"></span>
              </Link>
            </li>
            <li className="my-2.5 md:my-0 md:mx-3 w-full md:w-auto">
              <a href="https://github.com/PiyushTiwari10/T-HUB-" target="_blank" rel="noopener noreferrer" className={`${navLinkClasses}`}>
                <FaGithub />
                <span>GitHub</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3498db] transition-all duration-300 group-hover:w-full md:block hidden"></span>
              </a>
            </li>
            <li className="my-2.5 md:my-0 md:ml-3 md:flex md:items-center w-full md:w-auto">
              <LogoutButton className={logoutButtonNavbarClasses} />
            </li>
          </ul>

          <form className="flex items-center bg-white/10 rounded-full py-1 px-2.5 mt-4 md:mt-0 md:ml-5 transition-all duration-300 focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-[#3498db]/50 w-full md:w-auto" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white py-1 px-2.5 outline-none placeholder-white/70 w-full md:w-[180px] text-sm"
            />
            <button type="submit" className="bg-transparent border-none text-white cursor-pointer flex items-center justify-center p-1">
              <FaSearch />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
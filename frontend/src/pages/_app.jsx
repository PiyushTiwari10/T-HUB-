// import '../App.css'; // Removed as Tailwind is now primary and App.css will be deleted
import '../index.css'; // This now includes Tailwind base styles
import { AuthProvider } from '../context/AuthContext';
import { SearchProvider } from '../context/SearchContext';
import AppContent from '../components/AppContent'; // Import the refactored AppContent
import Navbar from '../components/Navbar'; // Import Navbar

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <AppContent>
          {/* Navbar and main layout will be rendered here if user is authenticated */}
          {/* AppContent handles the !isAuthenticated case by rendering Auth component */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow max-w-[1200px] w-full mx-auto px-5 py-5">
              <Component {...pageProps} />
            </main>
            {/* You could add a Footer component here if needed */}
          </div>
        </AppContent>
      </SearchProvider>
    </AuthProvider>
  );
}

export default MyApp; 
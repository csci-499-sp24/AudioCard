import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '/styles/globals.css';
import '../styles/googleLogo.css';
import { AuthProvider, useAuth } from '../utils/authcontext';
import { DarkModeProvider } from '../utils/darkModeContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </DarkModeProvider>
    </AuthProvider>
  );
}


function AppContent({ Component, pageProps }) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && JSON.stringify(storedUser) !== JSON.stringify(user)) {
      setUser(storedUser);
    }

    const timer = setTimeout(() => {
      if (!user && (!router.pathname.startsWith('/cardsets/') || router.pathname !== '/cardsets/') && router.pathname !== '/login' && router.pathname !== '/signup' && router.pathname !== '/welcome') {
        router.push('/welcome');
      }
      setLoading(false);
    }, 100); 
  

    return () => clearTimeout(timer);
  }, [user, router]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return <Component {...pageProps} />;
}

export default MyApp;
import { useEffect } from 'react';
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
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && router.pathname !== '/login' && router.pathname !== '/signup' && router.pathname !== '/welcome') {
      router.push('/welcome');
    }
  }, [user, router]);

  return <Component {...pageProps} />;
}

export default MyApp;
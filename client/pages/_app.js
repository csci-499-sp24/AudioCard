import { useEffect } from 'react';
import { useRouter } from 'next/router';
import "/styles/globals.css";
import { DarkModeProvider } from '../utils/darkModeContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/bootstrap/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [router.pathname]); 
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}

export default MyApp;

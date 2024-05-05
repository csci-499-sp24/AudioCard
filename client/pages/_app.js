import '/styles/globals.css';
import '../styles/googleLogo.css';
import { AuthProvider } from './authcontext'
import { DarkModeProvider } from '../utils/darkModeContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Component {...pageProps} />
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default MyApp; 

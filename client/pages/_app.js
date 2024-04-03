import "/styles/globals.css";
import '../styles/googleLogo.css';
import { DarkModeProvider } from '../utils/darkModeContext';

function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}

export default MyApp;
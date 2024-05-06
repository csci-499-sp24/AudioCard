import "/styles/globals.css";
import '../styles/googleLogo.css';
import { DarkModeProvider } from '../utils/darkModeContext';
import { LanguageProvider } from '../utils/languageContext';

function MyApp({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </DarkModeProvider>
  );
}

export default MyApp;
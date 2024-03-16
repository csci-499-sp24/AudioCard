import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "/styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

//Import bootstrap JS only onto client-side
if (typeof window !== 'undefined') {
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
    .catch((error) => console.error('Error loading Bootstrap:', error));
}
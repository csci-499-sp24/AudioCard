import Head from "next/head"; 
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-h-svh">
      <Layout>
        <ToastContainer />
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

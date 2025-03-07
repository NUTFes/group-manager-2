import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-h-svh">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

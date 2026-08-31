import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

// Next.jsのAppコンポーネントをカスタマイズするためのコード
type CustomAppProps = AppProps<{
  session: Session;
}>;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <div className="max-h-svh">
      <SessionProvider session={session}>
        <Layout>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </div>
  );
}

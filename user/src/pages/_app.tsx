import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { ToastContainer } from 'react-toastify';
import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

// Next.jsのAppコンポーネントをカスタマイズするためのコード
type CustomAppProps = AppProps<{
  session: Session;
}>;

function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  return (
    <div className="max-h-svh">
      <SessionProvider session={session}>
        <AuthGuard>
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
              // transition={Bounce}
            />
            <Component {...pageProps} />
          </Layout>
        </AuthGuard>
      </SessionProvider>
    </div>
  );
}

export default appWithTranslation(App);

import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
  // HeaderのonClickの動作をカスタマイズしたい場合はpropsで受け取ることも可能です
  headerOnClick?: () => void;
}

const Layout = ({ children, headerOnClick = () => {} }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* ヘッダー */}
      <Header onClick={headerOnClick} />

      {/* メインコンテンツ */}
      <main className="w-full grow">{children}</main>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Layout;

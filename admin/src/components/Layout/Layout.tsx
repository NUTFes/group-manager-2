import { FC, ReactNode } from 'react';
import Header from '../Header';
import Menu from '../Menu';

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <Menu />
      <main className="ml-sidebar mt-[60px] p-8">{children}</main>
    </div>
  );
};

export default Layout;

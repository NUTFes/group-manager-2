import NewsList from '@/components/NewsList';

export default function Home() {
  return (
    <div className="flex m-4 gap-10 flex-col lg:m-10 lg:flex-row">
      <NewsList isLoginPage={true} />
      <LoginForm />
    </div>
  );
}

const LoginForm = () => {
  return (
    <div className="size-[400px] mx-auto bg-slate-500">
      ログインコンポーネント
    </div>
  );
};

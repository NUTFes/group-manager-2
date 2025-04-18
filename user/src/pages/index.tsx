import NewsList from '@/components/NewsList';

export default function Home() {
  return (
    <div className="m-4 flex flex-col gap-20 lg:m-20 lg:flex-row">
      <NewsList isLoginPage={true} />
      <LoginForm />
    </div>
  );
}

const LoginForm = () => {
  return (
    <div className="h-40 min-w-max bg-slate-500 lg:size-96 ">
      ログインコンポーネント
    </div>
  );
};

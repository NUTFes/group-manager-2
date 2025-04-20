import NewsList from '@/components/NewsList';

export default function Home() {
  return (
    <div className="m-4 flex flex-col gap-10 lg:m-10 lg:flex-row">
      <NewsList isLoginPage={true} />
      <LoginForm />
    </div>
  );
}

const LoginForm = () => {
  return (
    <div className="size-[400px] mx-auto bg-slate-500 ">
      ログインコンポーネント
    </div>
  );
};

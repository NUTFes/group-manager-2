import NewsList from '@/components/NewsList';

export default function HomePage() {
  return (
    <div className="m-4 flex flex-col-reverse justify-center gap-16 lg:mx-20 lg:my-16 lg:flex-row">
      <ApplicationForm />
      <div className="h-max min-w-max pt-4">
        <NewsList isLoginPage={false} />
      </div>
    </div>
  );
}

const ApplicationForm = () => {
  return (
    <div className="flex w-full flex-col gap-20">
      <div className="text-4xl font-bold text-main">申請登録</div>
      <div className="flex flex-col gap-10">
        <div className="flex h-20 min-w-max items-center justify-center bg-slate-500 lg:w-3/5">
          団体申請
        </div>
        <div className="flex h-20 min-w-max items-center justify-center bg-slate-500 lg:w-3/5">
          団体申請
        </div>
      </div>
    </div>
  );
};

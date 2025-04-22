import NewsList from '@/components/NewsList';

export default function HomePage() {
  return (
    <div className="m-4 flex flex-col-reverse justify-center gap-4 lg:mx-10 lg:my-16 lg:flex-row">
      <ApplicationForm />
      <div className="flex justify-center">
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
        <div className="mx-auto flex h-20 w-[450px] items-center justify-center bg-slate-500 md:w-[560px]">
          団体申請
        </div>
        <div className="mx-auto flex h-20 w-[450px] items-center justify-center bg-slate-500 md:w-[560px]">
          団体申請
        </div>
      </div>
    </div>
  );
};

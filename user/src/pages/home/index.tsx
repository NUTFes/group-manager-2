import NewsList from '@/components/NewsList';

export default function HomePage() {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <NewsList isLoginPage={false} />
    </div>
  );
}

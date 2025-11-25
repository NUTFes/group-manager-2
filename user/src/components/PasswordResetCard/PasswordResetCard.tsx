import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import TextBox from '@/components/Form/TextBox';

const DEFAULT_REDIRECT_PATH = '/password_reset.html';

const buildRedirectUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return '';
  try {
    const url = new URL(apiUrl);
    url.pathname = DEFAULT_REDIRECT_PATH;
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch (error) {
    console.error('Invalid NEXT_PUBLIC_API_URL:', apiUrl, error);
    return '';
  }
};

const ERROR_MESSAGE =
  'パスワード再設定メールの送信に失敗しました。メールアドレスが間違っているか、登録されていない可能性があります。';

const PasswordResetCard = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectUrl = useMemo(() => buildRedirectUrl(), []);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast.error('メールアドレスを入力してください。');
      return;
    }
    if (!apiUrl) {
      console.error(
        'NEXT_PUBLIC_API_URL is not defined.',
        'Password reset cannot proceed.'
      );
      toast.error(ERROR_MESSAGE);
      return;
    }
    if (!redirectUrl) {
      console.error('Redirect URL for password reset is invalid.');
      toast.error(ERROR_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          redirect_url: redirectUrl,
        }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        if (body) {
          console.error('Password reset error body:', body);
        }
        toast.error(ERROR_MESSAGE);
        return;
      }

      toast.success('パスワード再設定メールを送信しました。');
      setEmail('');
    } catch (error) {
      console.error('Failed to request password reset:', error);
      toast.error(ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center gap-6 rounded-[30px] bg-white px-6 py-8 shadow-2xl">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold text-font">パスワードをお忘れの方</h2>
        <p className="text-sm text-sub">
          登録済みのメールアドレスを入力すると、パスワード再設定用のリンクをお送りします。
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6"
      >
        <TextBox
          label="メールアドレス"
          type="email"
          value={email}
          onChange={setEmail}
          required
          note="登録済みのメールアドレスを入力してください。"
        />
        <Button size="pc" color="main" type="submit" isDisable={isSubmitting}>
          パスワード再設定メールを送信
        </Button>
      </form>
    </div>
  );
};

export default PasswordResetCard;

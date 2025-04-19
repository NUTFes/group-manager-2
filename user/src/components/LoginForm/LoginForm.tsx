import { FC, useState } from 'react';
import Button from '@/components/Button';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useAuth } from '@/hooks/useAuth';

type LoginFormProps = {
  onSuccess?: () => void;
};

const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      console.error('ログインエラー:', err);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <h2 className="text-2xl font-bold text-font">ログイン</h2>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <TextBox
          label="メールアドレス"
          value={email}
          type="email"
          note="例：s123456@stn.nagaokaut.ac.jp"
          required
          onChange={setEmail}
        />

        <TextBox
          label="パスワード"
          value={password}
          type="password"
          note="英数字8文字以上"
          required
          onChange={setPassword}
        />

        <div className="flex justify-center">
          <Button type="submit" size="pc" color="main">
            ログイン
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;

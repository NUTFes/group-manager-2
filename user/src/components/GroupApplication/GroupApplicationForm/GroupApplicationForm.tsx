import { FC, use, useEffect } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';

// バリデーションスキーマ
const userSchema = z.object({
  name: z.string().min(1, '入力してください'),
  project_name: z.string().min(1, '入力してください'),
  activity: z.string().min(1, '入力してください'),
  user_id: z.number(),
  group_category_id: z.string().min(1, '選択してください'),
  fes_year_id: z.number(),
  committee: z.number(),
  is_international: z.string().min(1, '選択してください'),
  is_external: z.string().min(1, '選択してください'),
});

type GroupApplicationFormProps = {};

type GroupCategory = {
  id: number;
  name: string;
};

const GroupApplicationForm: FC<GroupApplicationFormProps> = () => {
  const [groupName, setGroupName] = useState<string>('');
  const [planName, setPlanName] = useState<string>('');
  const [international, setInternational] = useState<string>('');
  const [offCanmpus, setOffCampus] = useState<string>('');
  const [selector, setSelector] = useState<string>('1');
  const [textArea, setTextArea] = useState<string>('');
  const [group_categories, setGroupCategories] = useState<GroupCategory[]>([]);
  const [errors, setErrors] = useState({
    name: '',
    project_name: '',
    activity: '',
    user_id: '',
    group_category_id: '',
    fes_year_id: '',
    committee: '',
    is_international: '',
    is_external: '',
  });

  // 参加団体情報のPOST
  const handleSubmit = async () => {
    // 送信データの作成
    const formData = {
      name: groupName,
      project_name: planName,
      activity: textArea,
      user_id: 1,
      group_category_id: selector,
      fes_year_id: 1,
      committee: 0,
      is_international: international,
      is_external: offCanmpus,
    };
    console.log(formData);

    try {
      // バリデーション
      userSchema.parse(formData);
      // errorの初期化
      setErrors({
        name: '',
        project_name: '',
        activity: '',
        user_id: '',
        group_category_id: '',
        fes_year_id: '',
        committee: '',
        is_international: '',
        is_external: '',
      });

      // POST処理
      const res = await fetch('http://localhost:3000/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // 処理結果の表示
      console.log(res);
    } catch (err: any) {
      // エラーメッセージを格納する変数を定義
      const fieldErrors: any = {};
      // エラーメッセージを取得
      err.errors.forEach((error: any) => {
        fieldErrors[error.path[0]] = error.message;
      });
      // エラーメッセージをセット
      setErrors(fieldErrors);
    }
  };

  // 参加形式の取得
  const getGroupCategories = async () => {
    const res = await fetch('http://localhost:3000/group_categories');
    const group_categories = await res.json();
    setGroupCategories(group_categories.data);
  };

  useEffect(() => {
    getGroupCategories();
  }, []);

  return (
    <FormContainer>
      <TextBox
        label={'団体名'}
        value={groupName}
        onChange={setGroupName}
        note={'例：技大祭実行委員会'}
        required={true}
        error={errors.name}
      ></TextBox>
      <TextBox
        label={'企画名'}
        value={planName}
        onChange={setPlanName}
        note={'例：ギダイジャー'}
        required={true}
        error={errors.project_name}
      ></TextBox>
      <Radio
        label={'国際団体（留学生団体）ですか？'}
        value={international}
        onChange={setInternational}
        required={true}
        note={'注意書き'}
        error={errors.is_international}
        options={[
          { id: 0, name: 'いいえ、国際団体（留学生団体）ではありません。' },
          { id: 1, name: 'はい、国際団体（留学生団体）です。' },
        ]}
      ></Radio>
      <Radio
        label={'学外の団体ですか？'}
        value={offCanmpus}
        onChange={setOffCampus}
        required={true}
        note={'注意書き'}
        error={errors.is_external}
        options={[
          { id: 0, name: 'いいえ、学内の団体です。' },
          { id: 1, name: 'はい、学外の団体です。' },
        ]}
      ></Radio>
      <Selector
        label={'参加形式'}
        value={selector}
        onChange={setSelector}
        required={true}
        note={'注意書き'}
        error={errors.group_category_id}
        options={group_categories}
      ></Selector>
      <TextArea
        label={'企画内容'}
        value={textArea}
        onChange={setTextArea}
        required={true}
        note={'〇〇の販売、〇〇のパフォーマンスなど'}
        error={errors.activity}
      ></TextArea>

      <div className="flex justify-center w-full">
        <Button
          size={'pc'}
          color={'main'}
          type={'button'}
          onClick={handleSubmit}
        >
          登録
        </Button>
      </div>
    </FormContainer>
  );
};

export default GroupApplicationForm;

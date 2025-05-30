import { FC } from 'react';
import { UserInformation } from '@/api/useUserDetailApi';
import { DepartmentList, GradeList } from '@/utils/list';
import Button from '../Button';
import Selector from '../Form/Selector';
import TextBox from '../Form/TextBox';
import Modal from '../Modal';
import { useUserEditModalHooks } from './hooks';

type UserEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userInformation?: UserInformation;
  mutate?: () => void;
};

const UserEditModal: FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  userInformation,
  mutate,
}) => {
  const { errors, values, setValue, trigger, validateEdit, handleSubmitForm } =
    useUserEditModalHooks(userInformation, mutate);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmitForm}>
        <section className="rounded-2xl bg-white px-8 py-10 shadow-md md:px-16 md:py-5">
          <div className="min-w-0 flex-none basis-full p-4">
            <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
              <TextBox
                label="名前"
                value={values.name || ''}
                note="例：長岡 太郎"
                required
                error={errors.name?.message}
                onChange={(value: string) => setValue('name', value)}
                onBlur={() => trigger('name')}
              />
              <TextBox
                label="メールアドレス"
                type="email"
                value={values.mail || ''}
                note="例：s123456@stn.nagaokaut.ac.jp"
                required
                error={errors.mail?.message}
                onChange={(value: string) => setValue('mail', value)}
                onBlur={() => trigger('mail')}
              />
              <TextBox
                label="電話番号"
                value={String(values?.tel) || ''}
                note="例：09012345678"
                required
                error={errors.tel?.message}
                onChange={(value: string) => setValue('tel', value)}
                onBlur={() => trigger('tel')}
              />
              <TextBox
                label="学籍番号"
                value={String(values?.studentId) || ''}
                note="例：12345678"
                required
                error={errors.studentId?.message}
                onChange={(value: string) => setValue('studentId', value)}
                onBlur={() => trigger('studentId')}
              />
              <Selector
                label="学年"
                required
                onChange={(value: string) => setValue('gradeId', Number(value))}
                options={GradeList}
                value={values?.gradeId || 0}
                error={errors.gradeId?.message}
              />
              <Selector
                label="学科"
                required
                onChange={(value: string) =>
                  setValue('departmentId', Number(value))
                }
                options={DepartmentList}
                value={values?.departmentId || 0}
                error={errors.departmentId?.message}
              />
              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={validateEdit()}
              >
                修正
              </Button>
            </div>
          </div>
        </section>
      </form>
    </Modal>
  );
};

export default UserEditModal;

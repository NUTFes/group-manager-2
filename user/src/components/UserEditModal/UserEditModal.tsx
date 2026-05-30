import { FC } from 'react';
import { UserInformation } from '@/api/useUserDetailApi';
import Button from '../Button';
import Selector from '../Form/Selector';
import TextBox from '../Form/TextBox';
import Modal from '../Modal';
import { useUserEditModalHooks, useUserEditModalTexts } from './hooks';

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
  const userEditModalTexts = useUserEditModalTexts();
  const { errors, values, setValue, trigger, validateEdit, handleSubmitForm } =
    useUserEditModalHooks(userInformation, mutate);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmitForm}>
        <section className="rounded-2xl bg-white px-8 py-10 shadow-md md:px-16 md:py-5">
          <div className="min-w-0 flex-none basis-full p-4">
            <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
              <TextBox
                label={userEditModalTexts.labels.name}
                value={values.name || ''}
                note={userEditModalTexts.notes.name}
                required
                error={errors.name?.message}
                onChange={(value: string) => setValue('name', value)}
                onBlur={() => trigger('name')}
              />
              <TextBox
                label={userEditModalTexts.labels.email}
                type="email"
                value={values.mail || ''}
                note={userEditModalTexts.notes.email}
                required
                error={errors.mail?.message}
                onChange={(value: string) => setValue('mail', value)}
                onBlur={() => trigger('mail')}
              />
              <TextBox
                label={userEditModalTexts.labels.tel}
                value={String(values?.tel) || ''}
                note={userEditModalTexts.notes.tel}
                required
                error={errors.tel?.message}
                onChange={(value: string) => setValue('tel', value)}
                onBlur={() => trigger('tel')}
              />
              <TextBox
                label={userEditModalTexts.labels.studentId}
                value={String(values?.studentId) || ''}
                note={userEditModalTexts.notes.studentId}
                required
                error={errors.studentId?.message}
                onChange={(value: string) => setValue('studentId', value)}
                onBlur={() => trigger('studentId')}
              />
              <Selector
                label={userEditModalTexts.labels.grade}
                required
                onChange={(value: string) => setValue('gradeId', Number(value))}
                options={userEditModalTexts.gradeOptions}
                value={values?.gradeId || 0}
                error={errors.gradeId?.message}
              />
              <Selector
                label={userEditModalTexts.labels.department}
                required
                onChange={(value: string) =>
                  setValue('departmentId', Number(value))
                }
                options={userEditModalTexts.departmentOptions}
                value={values?.departmentId || 0}
                error={errors.departmentId?.message}
              />
              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={validateEdit()}
              >
                {userEditModalTexts.actions.edit}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </Modal>
  );
};

export default UserEditModal;

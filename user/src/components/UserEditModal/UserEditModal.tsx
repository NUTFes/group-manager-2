import { FC, useMemo } from 'react';
import { UserInformation } from '@/api/useUserDetailApi';
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);
  const { errors, values, setValue, trigger, validateEdit, handleSubmitForm } =
    useUserEditModalHooks(userInformation, mutate);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmitForm}>
        <section className="rounded-2xl bg-white px-8 py-10 shadow-md md:px-16 md:py-5">
          <div className="min-w-0 flex-none basis-full p-4">
            <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
              <TextBox
                label={t('userEditModal.labels.name')}
                value={values.name || ''}
                note={t('userEditModal.notes.name')}
                required
                error={errors.name?.message}
                onChange={(value: string) => setValue('name', value)}
                onBlur={() => trigger('name')}
              />
              <TextBox
                label={t('userEditModal.labels.email')}
                type="email"
                value={values.mail || ''}
                note={t('userEditModal.notes.email')}
                required
                error={errors.mail?.message}
                onChange={(value: string) => setValue('mail', value)}
                onBlur={() => trigger('mail')}
              />
              <TextBox
                label={t('userEditModal.labels.tel')}
                value={String(values?.tel) || ''}
                note={t('userEditModal.notes.tel')}
                required
                error={errors.tel?.message}
                onChange={(value: string) => setValue('tel', value)}
                onBlur={() => trigger('tel')}
              />
              <TextBox
                label={t('userEditModal.labels.studentId')}
                value={String(values?.studentId) || ''}
                note={t('userEditModal.notes.studentId')}
                required
                error={errors.studentId?.message}
                onChange={(value: string) => setValue('studentId', value)}
                onBlur={() => trigger('studentId')}
              />
              <Selector
                label={t('userEditModal.labels.grade')}
                required
                onChange={(value: string) => setValue('gradeId', Number(value))}
                options={gradeOptions}
                value={values?.gradeId || 0}
                error={errors.gradeId?.message}
              />
              <Selector
                label={t('userEditModal.labels.department')}
                required
                onChange={(value: string) =>
                  setValue('departmentId', Number(value))
                }
                options={departmentOptions}
                value={values?.departmentId || 0}
                error={errors.departmentId?.message}
              />
              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={validateEdit()}
              >
                {t('form.actions.edit')}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </Modal>
  );
};

export default UserEditModal;

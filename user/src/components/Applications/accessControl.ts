export type ApplicationAccessInput = {
  isRegistered?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
};

export type ApplicationAccess = {
  canSubmit: boolean;
  isDeadline: boolean;
};

export const resolveApplicationAccess = ({
  isRegistered,
  canAdd,
  canEdit,
}: ApplicationAccessInput): ApplicationAccess => {
  const canSubmit = isRegistered ? !!canEdit : !!canAdd;

  return {
    canSubmit,
    isDeadline: !canSubmit,
  };
};

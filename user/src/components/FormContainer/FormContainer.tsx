import React, { FC } from 'react';

type FormContainerProps = {
  children: React.ReactNode;
};

const FormContainer: FC<FormContainerProps> = ({ children }) => {
  return (
    <div className="inline-flex flex-col items-start justify-start gap-10 overflow-hidden rounded-[20px] border border-[#b2b2b2] bg-baseColor p-6 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] md:p-20">
      {children}
    </div>
  );
};

export default FormContainer;

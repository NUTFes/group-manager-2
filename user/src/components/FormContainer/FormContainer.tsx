import React, { FC } from "react";

type FormContainerProps = {
  children: React.ReactNode;
};

const FormContainer: FC<FormContainerProps> = ({ children }) => {
  return (
    <div className="md:p-5 p-20 bg-baseColor rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#b2b2b2] flex-col justify-start items-start md:gap-2 gap-10 inline-flex overflow-hidden">
      {children}
    </div>
  );
};

export default FormContainer;

import { FC, useState } from "react";
import GroupApplicationForm from "./GroupApplicationForm";
import AccordionMenu from "../AccordionMenu";

type GroupApplicationProps = {
    
};

const GroupApplication: FC<GroupApplicationProps> = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
        <AccordionMenu 
            title="団体申請"
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            isEdit={true}
            isExist={false}
            required={true}
            onSubmit={()=>{}}
        >
            <GroupApplicationForm />
        </AccordionMenu>
    )
};

export default GroupApplication;
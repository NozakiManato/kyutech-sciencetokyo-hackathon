import { Tabs } from "@radix-ui/react-tabs";
import React, { useMemo } from "react";
import { MdMenuBook } from "react-icons/md";

const Notebook: React.FC = () => {
    return (
        
        <Tabs>
            <MdMenuBook size={150} color={'00ffff'} />
        </Tabs>
    );
};

export default Notebook;

import { useState } from "react";
import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons";

interface Props {
    isOpen?: boolean;
    children?: React.ReactNode;
    trigger: React.ReactNode;
}

export const Collapsible = ({ isOpen = true, children, trigger }: Props) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <RadixCollapsible.Root className="w-[300px]" open={open} onOpenChange={setOpen}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <RadixCollapsible.Trigger asChild>{trigger}</RadixCollapsible.Trigger>
            </div>

            <RadixCollapsible.Content>
                <div className="p-4">{children}</div>
            </RadixCollapsible.Content>
        </RadixCollapsible.Root>
    );
};

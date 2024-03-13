import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

const ToastFail = (props: any) => {
    const [open, setOpen] = React.useState(true);
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root
                className=" bg-red-300 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-100 data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
                open={open}
                onOpenChange={setOpen}
            >
                <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px] bg-red-300">
                    <div id="toast-fail">
                        <div className="ml-3 m-0 text-slate11 text-[20px] leading-[1.3] text-red-600 inline-flex"> {props.message}</div>
                    </div>
                </Toast.Title>
                <Toast.Description asChild></Toast.Description>
            </Toast.Root>
            <Toast.Viewport className="[--viewport-padding:_25px] fixed top-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
        </Toast.Provider>
    );
};

export default ToastFail;

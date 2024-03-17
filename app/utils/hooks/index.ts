import { useEffect, useRef } from "react";
import { useNavigate, useRevalidator } from "@remix-run/react";

export const useLogout = () => {
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    return () => {
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        revalidator.revalidate();
        navigate("/");
    };
};

export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        isMountRef.current = false;
    }, []);
    return isMountRef.current;
};

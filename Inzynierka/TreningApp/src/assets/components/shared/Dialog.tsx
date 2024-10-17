import { useEffect, useState } from "react";

const DialogComponent = ({ children, level }: { children: React.ReactNode, level: number | undefined }) => {

    const [dialogPosition, setDialogPosition] = useState({ top: 0, left: "50%" });

    useEffect(() => {
        updateDialogPosition();
        window.addEventListener('scroll', updateDialogPosition);
        return () => {
            window.removeEventListener("scroll", updateDialogPosition);
        }
    }, [])

    const updateDialogPosition = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        setDialogPosition({
          top: scrollY + windowHeight / 2,
          left: "50%",
        });
    };

    return (
        <div className="dialog"
            style={{
                zIndex: `${(level || 1) * 100}`,
                top: `${dialogPosition.top}px`,
                left: `${dialogPosition.left}px`
            }}
            >
            {children}
        </div>
    )
}

export default DialogComponent

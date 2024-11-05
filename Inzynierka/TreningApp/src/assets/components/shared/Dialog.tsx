import { useEffect, useState } from "react";
import MoveUpAndDown from "../motion/MoveUpAndDown";

const DialogComponent = ({ children, level, closeDialogFunction, moveUp }: { children: React.ReactNode, level: number | undefined, closeDialogFunction: () => void, moveUp: boolean | undefined }) => {

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
        <>
            <div className='portal_background' onClick={closeDialogFunction}/>

            {moveUp ? 
                <MoveUpAndDown direction='up'>
                    <div className="dialog"
                        style={{
                            zIndex: `${(level || 1) * 100}`,
                            top: `${dialogPosition.top}px`,
                            left: `${dialogPosition.left}px`
                        }}
                        >
                        {children}
                    </div>          
                </MoveUpAndDown> : <div className="dialog"
                    style={{
                        zIndex: `${(level || 1) * 100}`,
                        top: `${dialogPosition.top}px`,
                        left: `${dialogPosition.left}px`
                    }}
                    >
                    {children}
                </div>
            }
        </>
        
        
    )
}

export default DialogComponent

import { RefObject } from "react"


const useOnClickOutside = (object:RefObject<HTMLElement>, func:(e:Event) => void) => {
    const lisener = (e:Event) => {
        if(object.current && !object.current.contains(e?.target as Node))
        {
            func(e);
        }
    }
    window.addEventListener('mousedown', lisener);
    window.addEventListener('touchstart', lisener);
    return () => {
        window.removeEventListener('mousedown', lisener);
        window.removeEventListener('touchstart', lisener);
    }
}

export default useOnClickOutside

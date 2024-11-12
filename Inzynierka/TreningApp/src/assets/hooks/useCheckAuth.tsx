import { useNavigate } from "react-router-dom";

function useCheckAuth() {
    const navigate = useNavigate();

    const checkIsUserAuthorized = (userId:number) => {
        if(userId<0) {
            navigate('/');
        }
    }

    const checkIsUserAuthorizedAsAdmin = (userId:number, userRole:string) => {
        if(userId<0 || (userId>0 && userRole!='ADMIN')) {
            navigate('/');
        }
    }
    return (
        { checkIsUserAuthorized, checkIsUserAuthorizedAsAdmin }
    )
}

export default useCheckAuth

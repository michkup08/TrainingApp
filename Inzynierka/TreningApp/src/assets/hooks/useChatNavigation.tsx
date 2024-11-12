import { useNavigate } from "react-router-dom"

export const useChatNavigation = () => {
    const navigate = useNavigate();

    const openChatWithUser = (userId:number, fullName:string) => {
        navigate('/chats', { state: { trainerId:userId, fullName:fullName } });
    };

    return (
        {openChatWithUser}
    )
}
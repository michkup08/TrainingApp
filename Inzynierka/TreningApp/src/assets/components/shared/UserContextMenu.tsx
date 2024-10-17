import { useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import '../../css/ContextMenu.css'
import { useNavigate } from "react-router-dom";

interface ContextMenuProps {
    closeContextMenu: () => void;
    left: number;
    top: number;
    userId: number;
    userFullName: string;
    showProfileFunc: () => void;
}

const UserContextMenu = ({closeContextMenu, left, top, userId, userFullName, showProfileFunc}:ContextMenuProps) => {
    const navigate = useNavigate();
    const contextMenu = useRef(null);
    useOnClickOutside(contextMenu, closeContextMenu);

    const handleStartChat = (trainerId:number, fullName:string) => {
        navigate('/chats', { state: { trainerId, fullName } });
    };

    return (
        <div
            ref={contextMenu}
            onClick={() => closeContextMenu}
            style={{position:'absolute', top: `${top}px`, left: `${left}px`}}>
                <div className='contextMenuButtons'>
                    <div className='contextMenuButton' onClick={() => {showProfileFunc(); closeContextMenu();}}>
                        Show Profile
                    </div>
                    <div className='contextMenuButton' onClick={() => handleStartChat(userId, userFullName)}>
                        Open chat with {userFullName}
                    </div>
                    <div className='contextMenuButton'>
                        Report {userFullName}
                    </div>
                </div>
        </div>
    )
}

export default UserContextMenu

import React from 'react';
import UserContextMenu from "../userComponents/UserContextMenu";
import { ContextMenu, DialogsVisible } from './PostTypes';

interface UserContextMenuWrapperProps {
    userContextMenu: ContextMenu;
    setUserContextMenu: React.Dispatch<React.SetStateAction<ContextMenu>>;
    setDialogsVisible: React.Dispatch<React.SetStateAction<DialogsVisible>>;
}

const UserContextMenuWrapper:React.FC<UserContextMenuWrapperProps> = React.memo(({ userContextMenu, setUserContextMenu, setDialogsVisible }) => {

    const handleCloseContextMenu = () => {
        setUserContextMenu(prev => ({
            ...prev,
            show: false
        }));
    };

    const handleDetailsDialogVisible = () => {
        setDialogsVisible(prev => ({
            ...prev,
            detailsUser: true
        }));
    };

    const handleReportDialogVisible = () => {
        setDialogsVisible(prev => ({
            ...prev,
            reportUser: true
        }));
    };

    return (
        <UserContextMenu
            userId={userContextMenu.userId}
            userFullName={userContextMenu.userFullName}
            top={userContextMenu.top}
            left={userContextMenu.left}
            closeContextMenu={handleCloseContextMenu}
            showProfileFunc={() => {handleDetailsDialogVisible()}}
            showReportFunc={() => {handleReportDialogVisible()}}
            dontShowChatNav = {false}
        />
    );
});

export default UserContextMenuWrapper;

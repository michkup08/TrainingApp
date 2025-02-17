import { useEffect, useState } from "react";
import { UsersApi } from "../../service/UsersApi";
import '../../css/Avatar.css'
import { getInitials } from "../../utils/StringFunc";

const usersApi = new UsersApi();

interface AvatarComponentProps {
    senderId: number;
    senderFullName: string;
}

const AvatarComponent = ({ senderId, senderFullName }: AvatarComponentProps) => {
    
    const [avatar, setAvatar] = useState(<></>);

    useEffect(() => {
        getUsersAvatar(senderId, senderFullName).then((a) => {
            setAvatar(a);
        })
    }, [senderId, senderFullName])

    const getUsersAvatar = async (userId:number, senderFullName:string) => {
        try {
        const imageURL = await usersApi.fetchProfileImage(userId);
        if (imageURL) {
            return <div className="avatar"><img src={imageURL} className="profileImageAvatar" /></div>;
        } else {
            return <div className="avatar">{getInitials(senderFullName)}</div>;
        }
        } catch (error) {
            console.error('Error fetching user avatar:', error);
            return <div className="avatar">{getInitials(senderFullName)}</div>;
        }
    };

    return avatar;
};

export default AvatarComponent;
  
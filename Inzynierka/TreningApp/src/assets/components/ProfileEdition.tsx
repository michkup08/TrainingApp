import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import UserStats from '../DTO/UserStats';
import { StatsApi } from '../service/StatsApi';
import '../css/ProfileEdition.css'
import { UsersApi } from '../service/UsersApi';

export default function ProfileEdition() {
  const usersApi = new UsersApi();
  const statsApi = new StatsApi();
  const user = useContext(UserContext);
  const [userStats, setUserStats] = useState<UserStats>({id: 0, daysInARow: 0, totalTrainings: 0, totalExercises: 0});
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [newLoginInput, setNewLoginInput] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState(false);
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchProfileImage();
  }, [user]);

  const fetchStats = async() => {
    if(user && user.id)
    {
      const resp = await statsApi.GetUserStats(user.id!);
      if(resp)
      {
        setUserStats(resp);
      }
    }
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file.");
    }
  };

  const fetchProfileImage = async() => {
    if(user && user.id)
    {
      const resp = await usersApi.fetchProfileImage(user.id!);
      if(resp)
      {
        setProfileImageUrl(resp);
      }
    }
  }

  const getFileExtension = (file: File): string => {
    const fileNameParts = file.name.split('.');
    return fileNameParts[fileNameParts.length - 1];
};

  const handleUpdateUser = async() => {
    const resp = await usersApi.userUpdate(user.id!, newLogin, newPassword, newEmail, oldPassword);
    if(resp && selectedImage)
    {
      console.log(resp);
      const formData = new FormData();
      const renamedFile = new File([selectedImage], `${user.id}.${getFileExtension(selectedImage)}`);
      formData.append("file", renamedFile);
      const imageResp = await usersApi.profileImageUpload(formData);
      if(imageResp)
      {
        setNewImageUrl(null);
        setSelectedImage(null);
        console.log("user changed coorectly");
      }
    }
  }

  const handleChangeLoginInput = () => {
    setNewLoginInput(!newLoginInput);
    setNewLogin('');
  }

  const handleChangePasswordInput = () => {
    setNewPasswordInput(!newPasswordInput);
    setNewPassword('');
  }

  const handleChangeEmailInput = () => {
    setNewEmailInput(!newEmailInput);
    setNewEmail('');
  }

  return (
    <div className='profileContainer'>
      <div className='profileStatsWrapper'>
        <div className='statsContainer'>
          <div className='fireContainer'>
              <img src='/images/fire.png' className='fireImage'/>
              <h1 className='daysInARowCount'>{userStats.daysInARow}</h1>
          </div>
          <h4>days in a row!</h4>
          <h4>{userStats.totalTrainings} total trainings</h4>
          <h4>{userStats.totalExercises} total exercises</h4>
        </div>
      </div>
      <div className='userContainer'>
        { <img src={newImageUrl ? newImageUrl : profileImageUrl ?`${profileImageUrl}` : 'images/user-avatar.png'} className='profileImage' />}
        <input type="file" accept="image/*" id="fileInput" onChange={handleImageSelect} style={{ display: 'none' }} />
        <label htmlFor="fileInput" className="profileImageUpload">
          Choose Image
        </label>
        <h2 className='userNameSurname'>{user.name} {user.surname}</h2>
        <h3 className='userEmail'>{user.email}</h3>
        <button onClick={handleChangeLoginInput} className='changeUserButton'>{newLoginInput ? 'Discard changes' : 'Change login'}</button>
        {newLoginInput && <input className='userDataInput' value={newLogin} onChange={e => {setNewLogin(e.target.value)}} placeholder='New login'/>}
        <button onClick={handleChangePasswordInput} className='changeUserButton'>{newPasswordInput ? 'Discard changes' : 'Change password'}</button>
        {newPasswordInput && <input className='userDataInput' type='password' value={newPassword} onChange={e => {setNewPassword(e.target.value)}} placeholder='New password' />}
        <button onClick={handleChangeEmailInput} className='changeUserButton'>{newEmailInput ? 'Discard changes' : 'Change email'}</button>
        {newEmailInput && <input className='userDataInput' value={newEmail} onChange={e => {setNewEmail(e.target.value)}} placeholder='New email'/>}
        <br/>
        {(Boolean(newLogin) || Boolean(newPassword) || Boolean(newEmail) || Boolean(selectedImage)) && (
          <>
            <input className='userDataInput' type='password' value={oldPassword} onChange={e => {setOldPassword(e.target.value)}} placeholder='CurrentPassword'/>
            <button className='changeUserButton' onClick={handleUpdateUser} >Confirm changes</button>
          </>
          )}
      </div>
    </div>
  )
}

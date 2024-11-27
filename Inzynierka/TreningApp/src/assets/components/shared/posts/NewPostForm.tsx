import React, { useState, ChangeEvent } from 'react';
import { PostsApi } from "../../../service/PostsApi";
import { State } from './PostTypes';

const postsApi = new PostsApi();

interface NewPostFormProps {
    userId: number;
    userFullName: string;
    setState: React.Dispatch<React.SetStateAction<State>>;
}

const NewPostForm: React.FC<NewPostFormProps> = React.memo(({ userId, userFullName }) => {
    const [newPostText, setNewPostText] = useState<string>('');
    const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setNewImageUrl(URL.createObjectURL(file));
        }
    };

    const handleAddNewPost = async () => {
        if (!userId || !newPostText) return;

        const postId = await postsApi.addPost({ 
            senderId: userId, 
            senderFullName: userFullName, 
            context: newPostText, 
            id: 0, 
            likes:0, 
            liked:false, 
            image:'',
            dateTime: '',
            showComments: false,
            comments: [],
            commentsPage: 0 });
        if (postId && selectedImage) {
            const formData = new FormData();
            const renamedFile = new File([selectedImage], `${postId}.${selectedImage.name.split('.').pop()}`);
            formData.append("file", renamedFile);
            await postsApi.postImageUpload(formData);
        }

        setNewPostText('');
        setNewImageUrl(null);
        setSelectedImage(null);
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="avatar">+</div>
                <div className="post-info">
                    <span className="username">Add new post</span>
                </div>
            </div>
            <div className="postContextWrapper">
                <textarea
                    placeholder="Write your post"
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                />
            </div>
            
            <input type="file" accept="image/*" id="fileInput" onChange={handleImageSelect} style={{ display: 'none' }} />
            <label htmlFor="fileInput" className="custom-file-upload">Choose Image</label>
            {newImageUrl && <img src={newImageUrl} className="post-image" />}
            <button className="sendPostButton" onClick={handleAddNewPost}>Send</button>
        </div>
    );
});

export default NewPostForm;

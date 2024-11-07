import "../init";
import { useState, useEffect, useCallback, useContext } from 'react';
import { PostsApi } from "../../service/PostsApi";
import UserContextMenuWrapper from '../shared/posts/UserContextMenuWrapper';
import NewPostForm from "../shared/posts/NewPostForm";
import PostCard from "../shared/posts/PostCard";
import { ContextMenu, DialogsVisible, State } from "../shared/posts/PostTypes";
import { UserContext } from "../../context/UserContext";
import DialogComponent from "../shared/Dialog";
import UserReport from "../shared/userComponents/UserReport";
import UserProfile from "../shared/userComponents/UserProfile";
import '../../css/HomePage.css'

const postsApi = new PostsApi();

const PostsListPage = () => {
    const user = useContext(UserContext);
    const [state, setState] = useState<State>({
        posts: [],
        page: 0,
        loading: false,
        newPostText: '',
        newImageUrl: null,
        selectedImage: null,
        commentMessage: '',
    });
    const [dialogsVisible, setDialogsVisible] = useState<DialogsVisible>({ 
        detailsUser: false, 
        reportUser: false 
    })
    const [userContextMenu, setUserContextMenu] = useState<ContextMenu>({
        top: 0, 
        left: 0, 
        show: false, 
        userId: 0, 
        userFullName: '',
        clickedElement: undefined,
        clickedElementType: 'POST'
    })

    const fetchPosts = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const newPosts = await postsApi.getPostsList(state.page, user.id! || 0);
            setState(prev => ({
                ...prev,
                posts: state.page === 0 ? newPosts : [...prev.posts, ...newPosts],
                loading: false,
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [state.page, user.id]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleLoadMore = () => {
        setState(prev => ({ ...prev, page: prev.page + 1 }));
    };

    return (
        <div className='postsPageWrapper'>
            {userContextMenu.show && <UserContextMenuWrapper setDialogsVisible={setDialogsVisible} setUserContextMenu={setUserContextMenu} userContextMenu={userContextMenu} />}
            {dialogsVisible.detailsUser && 
                <DialogComponent level={1} closeDialogFunction={() => setDialogsVisible(prev => ({...prev, detailsUser: false}))} moveUp={true}>
                    <UserProfile userId={userContextMenu.userId}/>
                </DialogComponent>
            }
            {dialogsVisible.reportUser && 
                <DialogComponent level={1} closeDialogFunction={() => setDialogsVisible(prev => ({...prev, reportUser: false}))} moveUp={true}>
                    <UserReport 
                        senderId={user.id!} 
                        reportedId={userContextMenu.userId} 
                        reportedFullName={userContextMenu.userFullName}
                        invalidCommunicate={userContextMenu.clickedElement} 
                        communicateType={userContextMenu.clickedElementType}
                        closeReportInterfaceFunction={() => setDialogsVisible(prev => ({...prev, reportUser: false}))}
                        />
                </DialogComponent>
            }   
            <div className="posts-container">
                {user.id && user.id != 0 && 
                    <NewPostForm userId={user.id!} userFullName={user.name + ' ' + user.surname} setState={setState} />
                }
                {state.posts.map((post, index) => (
                    <PostCard
                        key={index}
                        post={post}
                        user={user}
                        setState={setState}
                        setContextMenu={setUserContextMenu}
                    />
                ))}
                <button onClick={handleLoadMore} disabled={state.loading} className="load-more-btn">
                    {state.loading ? 'Loading...' : 'More posts'}
                </button>
            </div>
        </div>
    );
};

export default PostsListPage;

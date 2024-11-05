import PostsComment from '../../../DTO/Comment';
import Message from '../../../DTO/Message';
import Post from '../../../DTO/Post'

export interface ContextMenu {
    top: number;
    left: number;
    show: boolean;
    userId: number;
    userFullName: string;
    clickedElement: Post | PostsComment | Message | undefined
    clickedElementType: 'POST' | 'COMMENT' | 'MESSAGE'
}

export interface DialogsVisible {
    detailsUser: boolean;
    reportUser: boolean;
}

export interface State {
    posts: Post[];
    page: number;
    loading: boolean;
    newPostText: string;
    newImageUrl: string | null;
    selectedImage: File | null;
    commentMessage: string;
}

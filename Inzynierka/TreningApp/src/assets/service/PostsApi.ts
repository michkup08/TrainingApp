import axios from "axios";
import Post from "../DTO/Post";
import PostsComment from "../DTO/Comment";

export const axiosInstance= axios.create();

export class PostsApi {
  baseURL: string = "http://localhost:8080/trainingappdb/posts";

  GetPostImage = async (postId:number) => {
    if (!postId) 
    {
      return '';
    }

    try 
    {
      const response = await axios.get(this.baseURL + `/image/${postId}`, {
        responseType: "blob",
      });
      if(response)
      {
        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        return imageUrl;
      }
      
    } 
    catch (error) 
    {
      console.error("Error fetching the image", error);
    }
    return null;
  };

  postImageUpload = async (formData:FormData): Promise<boolean> => {
    if (!formData) {
      return false;
    }

    try {
      await axios.post(this.baseURL + "/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Error uploading file", error);
    }
    return false;
  };
  
  getPostsList = async (page:number, userId:number): Promise<Post[]> => {
    try {
      const response = await axios.post(this.baseURL +'/unicalPosts', {
          page: page,
          userId: userId
      });
      const posts:Post[] = response.data;
      posts.forEach(post => {
        post.comments = [];
        post.commentsPage = 0;
        post.showComments = false;
      })
      return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    return [];
  }

  likeDislikePost = async (postId:number, userId:number) => {
    await axios.put(this.baseURL +'/likeDislike', {
      objectId: postId,
      userId: userId
    });
  }

  addPost = async (post:Post): Promise<number> => {
    try {
      const response = await axios.post(this.baseURL +'/post', post);
      return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    return 0;
  }

  getCommentsList = async (page:number, postId:number): Promise<PostsComment[]> => {
    try {
      const response = await axios.get(this.baseURL +`/comments/${postId}/${page}`);
      return response.data; 
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
    return [];
  }
}
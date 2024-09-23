import axios from "axios";
import Post from "../DTO/Post";

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
  
  getPostsList = async (earlierFechedPosts:Post[], limit:number): Promise<Post[]> => {
    try {
      const response = await axios.post(this.baseURL +'/unicalPosts', {
          posts: earlierFechedPosts,
          limit: limit,
          //page: page
      });
      
      return response.data;
      
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    return [];
  }

  addPost = async (post:Post): Promise<number> => {
    try {
      console.log(post);
      const response = await axios.post(this.baseURL +'/post', post);
      return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    return 0;
  }
}
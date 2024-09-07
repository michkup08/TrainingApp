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

    postImageUpload = async (file:File) => {
        if (!file) {
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          await axios.post(this.baseURL + "/image/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error uploading file", error);
        }
    };
    
    GetPostsList = async (earlierFechedPosts:Post[], limit:number) => {

    }
}
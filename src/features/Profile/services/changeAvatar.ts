import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import { UserData } from "../../Auth/dataTypes/dataTypes";

interface AvatarUploadResponse {
  user?: UserData;
  message?: string;
}

export const changeAvatar = async (imageAsset: any): Promise<{ success?: any; message: any; status?: any; data?: UserData }> => {
    try {
        const formData = new FormData();
        formData.append('avatar', {
            uri: imageAsset.uri,
            type: imageAsset.type || 'image/jpeg', 
            name: imageAsset.fileName || `avatar_${Date.now()}.jpg`, 
        } as any);
        const response = await apiClient.patch(ApiEndPoints.PROFILE.UPLOAD_AVATAR, formData);
        if (response.error) {
            return {
                success: false,
                message: response.error.message || 'An unexpected error occurred',
                status: response.status,
            };
        }   
        console.log("Avatar Uploaded Successfully...");
        
        // Extract the user object from response if it's nested
        const responseData = response.data as AvatarUploadResponse;
        const userData = responseData?.user || (response.data as UserData);
        
        return {
            success: true,
            message: responseData?.message || 'Avatar Uploaded Successfully',
            status: response.status,
            data: userData as UserData
        };  
    } catch (error: any) {
        console.log("Avatar Upload Failed..." , error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            status: error.response?.status || null,
        };
    }
}
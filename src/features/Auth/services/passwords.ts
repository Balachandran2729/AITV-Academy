import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";

export const changePassword = async (email: string): Promise<{ success?: any; message: any; status?: any }> => {
    try {
        const response = await apiClient.post(ApiEndPoints.AUTH.FORGOT_PASSWORD, { email }, { protected: false });
        if (response.error) {
            return {
                success: false,
                message: response.error.message || 'An unexpected error occurred',
                status: response.status,
            };
        }   
        console.log("Forgot Password Request Sent Successfully...");
        return {
            success: true,
            message: response.data || 'Forgot Password Request Sent Successfully',
            status: response.status,
        };  
    } catch (error: any) {
        console.log("Forgot Password Request Failed..." , error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            status: error.response?.status || null,
        };
    }
}
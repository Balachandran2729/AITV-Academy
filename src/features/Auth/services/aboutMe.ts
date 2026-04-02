import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import { UserData } from "../dataTypes/dataTypes";

export const getUserData = async (): Promise<{data : UserData ; error?: any , status?: any }> => {
    try {
        const response = await apiClient.get<UserData>(ApiEndPoints.AUTH.CURRENT_USER);

        if (response.error) {
            return {
                data: {
                    statusCode: response.data?.statusCode,
                    data: null,
                    message: response.error.message || 'Failed to fetch user data',
                    success: false,
                },
                error: response.error.details,
                status: response.data?.statusCode,
            };
        }   
        return {
            data: response.data as UserData,
            status: response.data?.statusCode,
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            data: {
                statusCode: 500,
                data: null,
                message: 'An unexpected error occurred',
                success: false,
            },
            error,
            status: 500,
        };
    }
}
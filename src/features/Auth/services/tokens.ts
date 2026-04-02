import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import { OtherLoginMethod,RefreshTokenResponse } from "../dataTypes/dataTypes";


export const refreshToken = async (): Promise<{data : RefreshTokenResponse ; error?: OtherLoginMethod , status?: any }> => {
    try {
        const response = await apiClient.get<RefreshTokenResponse>(ApiEndPoints.AUTH.REFRESH_TOKEN);

        if (response.error) {
            return {
                data: {
                    statusCode: response.status || null,
                    data: null,
                    message: response.error.message || null,
                    success: false,
                },
                error: response.error.details as OtherLoginMethod,
                status: response.status,
            };
        }
        console.log("Token Refreshed Successfully...");
        return {
            data: response.data as RefreshTokenResponse,
            status: response.status,
        };
    } catch (error: any) {
        console.log("Token Refresh Failed...");
        return {
            data: {
                statusCode: error.response?.status || null,
                data: null,
                message: error.message || 'An unexpected error occurred',
                success: false,
            },
            status: error.response?.status || null,
        };
    }
}
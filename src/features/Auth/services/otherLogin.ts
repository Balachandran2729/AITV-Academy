import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import {OtherLoginMethod  } from "../dataTypes/dataTypes";


export const GoogleLogin = async (): Promise<{data : any ; error?: OtherLoginMethod , status?: any }> => {
    try {
        const response = await apiClient.get<any>(ApiEndPoints.AUTH.GOOGLE_LOGIN);
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
        console.log("Google Login Successfully...");
        return {
            data: response.data as any,
            status: response.status,
        };
    } catch (error: any) {  
        console.log("Google Login Fail...");
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


export const GithubLogin = async (): Promise<{data : any ; error?: OtherLoginMethod , status?: any }> => {
    try {
        const response = await apiClient.get<any>(ApiEndPoints.AUTH.GIT_LOGIN);

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
        console.log("Github Login Successfully...");
        return {
            data: response.data as any,
            status: response.status,
        };
    } catch (error: any) {
        console.log("Github Login Fail...");
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


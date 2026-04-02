import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import {OtherLoginMethod , RegisterRequest , RegisterResponse } from "../dataTypes/dataTypes";


export const register = async (registerData: RegisterRequest): Promise<{data : RegisterResponse ; error?: OtherLoginMethod , status?: any }> => {
    try {
        const response = await apiClient.post<RegisterResponse>(ApiEndPoints.AUTH.REGISTER, registerData, { protected: false });

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
        console.log("Register Successfully...");
        return {
            data: response.data as RegisterResponse,
            status: response.status,
        };  
    } catch (error: any) {
        console.log("Register Fail..." , error);
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
import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import { LoginRequest, LoginResponse , OtherLoginMethod} from "../dataTypes/dataTypes";

export const login = async (loginData: LoginRequest): Promise<{data : LoginResponse ; error?: OtherLoginMethod , status?: any }> => {
    try {
        const response = await apiClient.post<LoginResponse>(ApiEndPoints.AUTH.LOGIN, loginData);

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
        console.log("Login Successfully...");
        return {
            data: response.data as LoginResponse,
            status: response.status,
        };
    } catch (error: any) {
        console.log("Login Fail...");
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
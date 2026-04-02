import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import {WebViewResponseSchema} from "../types/dataTypes";

export const getWebViewContent = async (): Promise<{data : any ; error?: any , status?: any }> => {


    try {
        const response = await apiClient.get(ApiEndPoints.COURSES.WEB_TEMPLEATE);
        const parsed = WebViewResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            console.error('Error parsing WebView content:', parsed.error);
            return {
                data: 'An unexpected error occurred' as any,
                error: parsed.error,
                status: 400,
            };
        }

        return {
            data: parsed.data,
            error: undefined,
            status: 200,
        };

    } catch (error) {
        console.error('Error fetching WebView content:', error);
        return {
            data: 'An unexpected error occurred' as any,
            error,
            status: 500,
        };
    }

}
import { apiClient } from "../../../core/config/apiInstance";
import { ApiEndPoints } from "../../../core/constants/ApiEndPoints";
import {allProductsResponse, SingleProductResponse} from "../types/dataTypes";

export const getAllProducts = async (page : number, limit : number): Promise<{data : allProductsResponse ; error?: any , status?: any }> => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        params.append('inc', 'category,price,thumbnail,images,title,id');
        params.append('query', 'mens-watches');
        
        const response = await apiClient.get<allProductsResponse>(ApiEndPoints.COURSES.GET_ALL, { params });
    if (response.error) {
        return {
            data: {
                statusCode: response.data?.statusCode || 500,
                success: false,
                message: response.error.message || 'Failed to fetch products',
                data: response.data?.data  as any || {},
            },
            error: response.error.details,
            status: response.data?.statusCode || 500,
        };
    }   
    return {
        data: response.data as allProductsResponse,
        status: response.data?.statusCode || 200,
    };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            data: {
                statusCode: 500,
                success: false,
                message: 'An unexpected error occurred',
                data: {} as any,
            },
            error,
            status: 500,
        };
    }
}


export const getProductById = async (id: string): Promise<{data : SingleProductResponse ; error?: any , status?: any }> => {

    try {
  const response = await apiClient.get<SingleProductResponse>(ApiEndPoints.COURSES.GET_BY_ID(id));
    if (response.error) {
        return {
            data: {
                statusCode: response.data?.statusCode || 500,
                success: false,
                message: response.error.message || 'Failed to fetch products',
                data: response.data?.data  as any || {},
            },  
            error: response.error.details,
            status: response.data?.statusCode || 500,
        };
    }
    console.log("Get Prodect By Fetch Successfully...");
    
    return {
        data: response.data as SingleProductResponse,
        status: response.data?.statusCode || 200,
    };

    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return {
            data: {
                statusCode: 500,
                success: false,
                message: 'An unexpected error occurred',
                data: {} as any,
            },
            error,
            status: 500,
        };
    }

}
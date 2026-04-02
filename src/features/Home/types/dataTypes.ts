import {z} from 'zod';

export const ProductSchema = z.object({
  id: z.number().nullable(),
  title: z.string().nullable(),
  description: z.string().optional(), 
  price: z.number().nullable(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),
  brand: z.string().optional().nullable(),
  category: z.string().nullable(),
  thumbnail: z.string().nullable(),
  images: z.array(z.string()).nullable(),
});


export const allProductsSchema = z.object({
  statusCode: z.number().nullable(),
  success: z.boolean().nullable(),
  message: z.string().nullable(),
  data: z.object({
    page: z.number().nullable(),
    limit: z.number().nullable(),
    totalPages: z.number().nullable(),
    previousPage: z.boolean().nullable(),
    nextPage: z.boolean().nullable(),
    totalItems: z.number().nullable(),
    currentPageItems: z.number().nullable(),
    data: z.array(
      ProductSchema.pick({
        id: true,
        title: true,
        price: true,
        category: true,
        thumbnail: true,
        images: true,
      })
    ),
  }),
});



export const SingleProductResponseSchema = z.object({
  statusCode: z.number(),
  success: z.boolean(),
  message: z.string(),
  data: ProductSchema, 
});


export const WebViewResponseSchema = z.string();

export type Product = z.infer<typeof ProductSchema>;

export type allProductsResponse = z.infer<typeof allProductsSchema>;

export type SingleProductResponse = z.infer<typeof SingleProductResponseSchema>;

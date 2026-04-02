import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { getAllProducts  } from '../services/prodects';
import CourseCard from '../components/CourseCard';


const HomeScreen = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigation = useNavigation<any>();
  
  // The 2 dynamic parameters
  const limit = 10; 

  const fetchCourses = async (currentPage: number) => {
    setLoading(true);
    const response = await getAllProducts(currentPage, limit);
    
    if (response.status === 200 && response.data?.success) {
      // Based on your Zod schema: response.data.data.data holds the array of items
      const fetchedItems = response.data.data.data;
      
      if (currentPage === 1) {
        setCourses(fetchedItems);
      } else {
        setCourses((prevCourses) => [...prevCourses, ...fetchedItems]);
      }
    } else {
      console.error("Failed to fetch:", response.error);
    }
    setLoading(false);
  };

  // Fetch data on initial mount and when page changes
  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  // Handle infinite scrolling
  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="flex-row items-center px-5 py-4 bg-white shadow-sm z-10 border-b border-gray-200">
        <Ionicons name="school" size={28} color="#2563EB" />
        <Text className="text-2xl font-extrabold text-gray-900 ml-3">
          All Courses
        </Text>
      </View>

      {/* FlashList Section */}
      <View className="flex-1 px-4 pt-4">
        <FlashList
          data={courses}
          renderItem={({ item }) => 
            <CourseCard course={item} 
            onPress={() => navigation.navigate('CourseById' as never, { id: item.id } as never)}
          />}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          // estimatedItemSize={145}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="large" color="#2563EB" className="my-4" />
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <Text className="text-center text-gray-500 mt-10">
                No courses found.
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;
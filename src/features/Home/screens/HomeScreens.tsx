import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TextInput,
  RefreshControl,
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { getAllProducts } from '../services/prodects';
import CourseCard from '../components/CourseCard';

const HomeScreen = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<any>();
  
  const limit = 10; 

  const fetchCourses = async (currentPage: number) => {
    setLoading(true);
    const response = await getAllProducts(currentPage, limit);
    
    if (response.status === 200 && response.data?.success) {
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

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    
    const query = searchQuery.toLowerCase().trim();
    return courses.filter((course) => {
      const title = course.title?.toLowerCase() || '';
      const description = course.description?.toLowerCase() || '';
      const category = course.category?.toLowerCase() || '';
      const brand = course.brand?.toLowerCase() || '';
      
      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        brand.includes(query)
      );
    });
  }, [courses, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setSearchQuery('');
    await fetchCourses(1);
    setRefreshing(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      
      {/* 1. Centered Header Section */}
      <View className="bg-white shadow-sm z-10 border-b border-gray-200">
        <View 
          style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }} 
          className="flex-row items-center px-5 py-4"
        >
          <Ionicons name="school" size={28} color="#2563EB" />
          <Text className="text-2xl font-extrabold text-gray-900 ml-3">
            All Courses
          </Text>
        </View>
      </View>

      {/* 2. Centered Search Bar Section */}
      <View className="bg-white border-b border-gray-200 shadow-sm">
        <View 
          style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }} 
          className="px-5 py-4"
        >
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              style={{ flex: 1 }}
              placeholder="Search courses, instructors..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="ml-3 text-base text-gray-900"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} className="p-1">
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 3. Centered List Section */}
      <View className="flex-1 w-full">
        <View 
          style={{ maxWidth: 800, width: '100%', alignSelf: 'center', flex: 1 }} 
          className="px-4 pt-4"
        >
          <FlashList
            data={filteredCourses}
            renderItem={({ item }) => 
              <CourseCard 
                course={item} 
                onPress={() => navigation.navigate('CourseById' as never, { id: item.id } as never)}
              />
            }
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2563EB']}
                progressBackgroundColor="#FFFFFF"
                tintColor="#2563EB"
              />
            }
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color="#2563EB" className="my-4" />
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View className="items-center justify-center mt-10">
                  <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                  <Text className="text-center text-gray-500 mt-4 text-base">
                    {searchQuery ? 'No courses found matching your search' : 'No courses found'}
                  </Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>

    </SafeAreaView>
  );
}

export default HomeScreen;
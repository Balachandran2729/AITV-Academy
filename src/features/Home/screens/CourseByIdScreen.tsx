import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProductById } from '../services/prodects';
import { Product } from '../types/dataTypes'; 
import { useBookmarkStore } from '../../../core/common/bookMarkConfig';


const CourseByIdScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const id = route.params?.id;
    
  const [course, setCourse] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // <-- Grab bookmark state and toggle function from Zustand
  const isBookmarked = useBookmarkStore((state) => 
    course?.id ? state.isBookmarked(course.id) : false
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      const response = await getProductById(id);

      if (response.status === 200 && response.data?.success) {
        setCourse(response.data.data);
      } else {
        setError('Failed to load course details. Please try again.');
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (id) {
      const response = await getProductById(id);
      if (response.status === 200 && response.data?.success) {
        setCourse(response.data.data);
        setError(null);
      } else {
        setError('Failed to refresh course details.');
      }
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-500 font-medium">Loading course...</Text>
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-lg text-center text-gray-800">{error || "Course not found"}</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Custom Header with Bookmark Toggle */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white z-10 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full bg-gray-50">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Text className="flex-1 text-center text-lg font-bold text-gray-900 px-2" numberOfLines={1}>
          Course Details
        </Text>

        {/* <-- The Bookmark Toggle Button --> */}
        <TouchableOpacity 
          onPress={() => course.id && toggleBookmark(course.id)} 
          className="p-2 -mr-2 rounded-full"
        >
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isBookmarked ? "#2563EB" : "#1F2937"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2563EB']}
          progressBackgroundColor="#FFFFFF"
          tintColor="#2563EB"
        />
      }>
        <Image 
          source={{ uri: course.images?.[0] || course.thumbnail || '' }} 
          className="w-full h-72 bg-gray-100"
          resizeMode="cover"
        />

        <View className="p-5 pb-24">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                {course.category?.replace('-', ' ')}
              </Text>
            </View>
            <View className="flex-row items-center bg-yellow-100 px-2 py-1 rounded-md">
              <Ionicons name="star" size={14} color="#D97706" />
              <Text className="text-xs font-bold text-yellow-800 ml-1">
                {course.rating || 'N/A'}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
            {course.title}
          </Text>

          {course.brand && (
            <Text className="text-sm font-medium text-gray-500 mb-6">
              Instructor / Brand: <Text className="text-gray-800">{course.brand}</Text>
            </Text>
          )}

          <Text className="text-lg font-bold text-gray-900 mb-2">About this course</Text>
          <Text className="text-base text-gray-600 leading-relaxed">
            {course.description || "No description available for this course."}
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-5 py-4 flex-row items-center justify-between pb-8">
        <View>
          <Text className="text-sm text-gray-500 font-medium">Total Price</Text>
          <Text className="text-2xl font-extrabold text-green-600">
            ${course.price}
          </Text>
        </View>
        <TouchableOpacity 
          className="bg-blue-600 px-8 py-4 rounded-xl shadow-sm shadow-blue-300"
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Web', {id: course.id})}
        >
          <Text className="text-white text-base font-bold tracking-wide">
            Enroll Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default CourseByIdScreen;
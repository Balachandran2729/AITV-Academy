import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/dataTypes'; 
import { useBookmarkStore } from '../../../core/common/bookMarkConfig';
interface CourseCardProps {
  course: Product;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  
  const isBookmarked = useBookmarkStore((state) => 
    course.id ? state.isBookmarked(course.id) : false
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100 overflow-hidden flex-row"
    >
      {/* Course Thumbnail */}
      <Image 
        source={{ uri: course.thumbnail || 'https://via.placeholder.com/150' }} 
        className="w-32 h-32 bg-gray-100"
        resizeMode="cover"
      />
      
      {/* Course Details */}
      <View className="flex-1 p-3 justify-center">
        
        {/* Top Row: Category + Bookmark Icon */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-2">
            <Text className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
              {course.category?.replace('-', ' ')}
            </Text>
            
            <Text className="text-base font-bold text-gray-800 mb-2" numberOfLines={2}>
              {course.title}
            </Text>
          </View>

          {/* 2. The Bookmark Button */}
          <TouchableOpacity
            activeOpacity={0.6}
            className="p-1 -mr-1 -mt-1"
            onPress={(e) => {
              // This stops the tap from triggering the parent card's onPress (navigation)
              e.stopPropagation(); 
              if (course.id) {
                toggleBookmark(course.id);
              }
            }}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#2563EB" : "#9CA3AF"} // Blue if active, gray if outline
            />
          </TouchableOpacity>
        </View>
        
        <Text className="text-lg font-extrabold text-green-600">
          ${course.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CourseCard;
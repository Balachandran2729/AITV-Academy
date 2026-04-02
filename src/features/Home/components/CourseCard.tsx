// src/components/CourseCard.tsx (Adjust path as needed)
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../types/dataTypes'; 

interface CourseCardProps {
  course: Product;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
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
        <Text className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
          {course.category?.replace('-', ' ')}
        </Text>
        
        <Text className="text-base font-bold text-gray-800 mb-2" numberOfLines={2}>
          {course.title}
        </Text>
        
        <Text className="text-lg font-extrabold text-green-600">
          ${course.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default CourseCard;
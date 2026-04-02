import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressState {
  completedCourseIds: number[]; 
  markAsComplete: (courseId: number) => void;
  isCompleted: (courseId: number) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedCourseIds: [],
      
      markAsComplete: (courseId) => {
        const currentCompleted = get().completedCourseIds;
        // Only add it if it's not already in the array
        if (!currentCompleted.includes(courseId)) {
          set({ completedCourseIds: [...currentCompleted, courseId] });
        }
      },
      
      isCompleted: (courseId) => get().completedCourseIds.includes(courseId),
    }),
    {
      name: 'course-progress', // Unique storage key
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
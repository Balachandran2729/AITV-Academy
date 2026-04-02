// src/store/useBookmarkStore.ts (Adjust path as needed)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Import the standalone function we just created
import { triggerBookmarkMilestoneNotification } from '../Notification/useNotifications'; 

interface BookmarkState {
  bookmarkedIds: number[];
  toggleBookmark: (courseId: number) => Promise<void>; // Note: This is now a Promise
  isBookmarked: (courseId: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      
      // 2. Make this async
      toggleBookmark: async (courseId) => { 
        const currentBookmarks = get().bookmarkedIds;
        const exists = currentBookmarks.includes(courseId);
        
        let newBookmarks;
        if (exists) {
          // Remove it
          newBookmarks = currentBookmarks.filter(id => id !== courseId);
        } else {
          // Add it
          newBookmarks = [...currentBookmarks, courseId];
          
          // 3. Trigger the notification!
          if (newBookmarks.length === 5) {
             await triggerBookmarkMilestoneNotification();
          }
        }
        
        set({ bookmarkedIds: newBookmarks });
      },
      
      isBookmarked: (courseId) => get().bookmarkedIds.includes(courseId),
    }),
    {
      name: 'course-bookmarks',
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
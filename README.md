# AITV Academy

A comprehensive educational mobile application built with **React Native** and **Expo**. **AITV Academy** provides a platform for users to browse, enroll in, and consume educational courses with a seamless mobile experience.

## 🚀 Tech Stack

- **Framework**: [React Native] with [Expo]
- **Styling**: [NativeWind] (Tailwind CSS for React Native)
- **State Management**: [Zustand]
- **Data Fetching**: [TanStack Query (React Query)] & [Axios]
- **Navigation**: [React Navigation] (Stack & Bottom Tabs)
- **Validation**: [Zod]
- **Storage**: [Async Storage] & [Expo Secure Store]
- **Notifications**: [Expo Notifications]

## 📁 Project Structure

```text
src/
├── core/                # Core configurations and shared utilities
│   ├── common/          # Shared components and configs
│   ├── config/          # API clients and error handling
│   ├── constants/       # API endpoints and global constants
│   ├── Navigation/      # Main navigation logic and splash screen
│   └── Notification/    # Push notifications and toast helpers
└── features/            # Feature-based modules
    ├── Auth/            # Authentication (Login, Register)
    ├── Home/            # Dashboard and Course browsing
    └── Profile/         # User profile and settings
```

## ✨ Key Features

- **Authentication**: Secure Login and Registration flow using JWT.
- **Course Management**: Browse available courses and view detailed course content.
- **Web Content**: Integrated WebView for interactive educational content.
- **Real-time Notifications**: Push notification support for user engagement and retention.
- **Offline Awareness**: Network status monitoring with custom overlays.
- **Dynamic Styling**: Consistent UI using Tailwind CSS patterns.


## 📱 Navigation Flow

1. **Splash Screen**: Initial loading and authentication state check.
2. **Auth Stack**: Login and Registration screens for unauthenticated users.
3. **App Stack (Tabs)**:
   - **Home Tab**: Course dashboard → Course details → Web view content.
   - **Profile Tab**: User account information and logout.

---

Built with ❤️ for **AITV Academy**.

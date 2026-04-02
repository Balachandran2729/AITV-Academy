import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute , useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getWebViewContent } from '../services/webView';
import { useProgressStore } from '../../Profile/store/useProgressStore';

const WebScreen = () => {
  const route = useRoute<any>();
  const id = route.params?.id;
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation<any>();

  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const markAsComplete = useProgressStore((state) => state.markAsComplete);



  // Fetch the HTML content when the screen mounts
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      const response = await getWebViewContent();

      if (response.status === 200 && response.data) {
        setHtmlContent(response.data);
      } else {
        setError('Failed to load course content. Please check your connection.');
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  // --- BIDIRECTIONAL BRIDGE: JS INJECTION ---
  // This script runs inside the WebView immediately after the page loads.
  // We use this to inject a button into the static HTML to prove we can send messages back to Native.
  const injectedScript = `
    const button = document.createElement('button');
    button.innerText = 'Mark Lesson Complete';
    button.style.padding = '14px 24px';
    button.style.backgroundColor = '#2563EB';
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.marginTop = '30px';
    button.style.width = '100%';
    button.style.cursor = 'pointer';
    
    // When clicked, send a message to React Native
    button.onclick = function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        action: 'LESSON_COMPLETE', 
        courseId: '${id || 'unknown'}' 
      }));
      button.innerText = 'Completed ✅';
      button.style.backgroundColor = '#10B981'; // Turn green
    };
    
    document.body.appendChild(button);
    
    // Customize body styling slightly for mobile
    document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    document.body.style.padding = '20px';
    document.body.style.color = '#1F2937';
    
    true; // Required for injectedJavaScript to run cleanly
  `;


  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.action === 'LESSON_COMPLETE') {
        markAsComplete(Number(data.courseId));
        setShowCompletedModal(true);
      }
    } catch (e) {
      console.error("Failed to parse WebView message", e);
    }
  };

  // --- ERROR UI ---
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-5">
        <Ionicons name="wifi-outline" size={64} color="#9CA3AF" />
        <Text className="text-lg text-center text-gray-800 mt-4">{error}</Text>
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
    <>
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white z-10 border-b border-gray-100 shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 rounded-full bg-gray-50">
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-gray-900 mr-8">
          Learning Content
        </Text>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="absolute z-20 inset-0 flex items-center justify-center bg-white/80 mt-16">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )}

      {!loading && htmlContent && (
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          
          // Inject our custom button and styling
          injectedJavaScript={injectedScript}
          
          // Listen for messages from the HTML
          onMessage={handleWebViewMessage}
          
          // Handle WebView internal crashes (Assignment Part 6.2)
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
            setError("The content failed to load unexpectedly.");
          }}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator size="large" color="#2563EB" className="absolute top-1/2 left-1/2 -ml-4 -mt-4" />
          )}
        />
      )}
    </SafeAreaView>

    {/* Lesson Completed Modal */}
    <Modal
      animationType="fade"
      transparent={true}
      visible={showCompletedModal}
      onRequestClose={() => setShowCompletedModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-8 w-4/5 items-center shadow-lg">
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          <Text className="text-2xl font-bold text-gray-900 mt-6 text-center">
            Lesson Completed!
          </Text>
          <Text className="text-lg text-gray-600 mt-4 text-center">
            Great job! Your progress has been saved.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowCompletedModal(false);
              navigation.goBack();
            }}
            className="mt-8 bg-blue-600 px-8 py-4 rounded-xl w-full items-center"
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
}
export default WebScreen;
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import type { ToastConfig } from 'react-native-toast-message';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CustomToast = ({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) => (
  <View className="w-[90%] bg-gray-900 rounded-lg shadow-lg p-4 min-h-[40px] flex justify-center">
    {text1 && (
      <Text className="text-white text-base font-bold">
        {text1}
      </Text>
    )}
    {text2 && (
      <Text className="text-white text-sm mt-1">
        {text2}
      </Text>
    )}
  </View>
);

const SuccessToast = ({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 12,
      bounciness: 8,
    }).start();
  }, [scaleAnim]);

  return (
    <View className="w-[90%] bg-gray-900 rounded-lg shadow-lg p-4 min-h-[40px] flex flex-row items-center z-9999">
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialCommunityIcons
          name="check-circle"
          size={26}
          color="#FFD500"
        />
      </Animated.View>

      <View className="ml-3 flex-1">
        {text1 && (
          <Text className="text-white text-base font-bold">
            {text1}
          </Text>
        )}
        {text2 && (
          <Text className="text-white text-sm mt-1">
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

const LoadingToast = ({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) => (
  <View className="w-[90%] bg-gray-900 rounded-lg shadow-lg p-4 min-h-[50px] flex flex-row items-center">
    <ActivityIndicator size="small" color="#FFD500" />
    <View className="ml-3 flex-1">
      {text1 && (
        <Text className="text-white text-base font-bold">
          {text1}
        </Text>
      )}
      {text2 && (
        <Text className="text-white text-sm mt-1">
          {text2}
        </Text>
      )}
    </View>
  </View>
);
const ConfirmToast = ({
  text1,
  text2,
  props,
}: {
  text1?: string;
  text2?: string;
  props?: any;
}) => (
  <View  className="w-[90%] bg-gray-900 rounded-lg shadow-lg p-4 min-h-[60px]">
    {text1 && (
      <Text className="text-gray-300 text-base font-bold">
        {text1}
      </Text>
    )}

    {text2 && (
      <Text className="text-gray-300 text-sm mt-1">
        {text2}
      </Text>
    )}

    <View className="flex-row justify-end mt-4 gap-6">
      <Text
        className="text-gray-300 text-md"
        onPress={() => {
          Toast.hide();
          props?.onCancel?.();
        }}
      >
        {props?.cancelText || 'CANCEL'}
      </Text>

      <Text
        className="text-[#ffdd00] text-md font-bold"
        onPress={async () => {
          Toast.hide();
          await props?.onConfirm?.();
        }}
      >
        {props?.confirmText || 'CONFIRM'}
      </Text>
    </View>
  </View>
);

export const toastConfig: ToastConfig = {
  success: (props: any) => (
    <SuccessToast text1={props.text1} text2={props.text2} />
  ),

  error: (props: any) => (
    <CustomToast text1={props.text1} text2={props.text2} />
  ),

  info: (props: any) => (
    <CustomToast text1={props.text1} text2={props.text2} />
  ),

  loading: (props: any) => (
    <LoadingToast text1={props.text1} text2={props.text2} />
  ),

  confirm: (props: any) => (
    <ConfirmToast
      text1={props.text1}
      text2={props.text2}
      props={props.props}
    />
  ),
};

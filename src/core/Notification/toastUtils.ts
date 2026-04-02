import Toast from 'react-native-toast-message';

let loadingToastId: string | null = null;

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 5000,
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 5000,
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 50,
      autoHide: true,
      visibilityTime: 5000,
    });
  },

  loading: (title: string, message?: string) => {
    loadingToastId = Math.random().toString();
    Toast.show({
      type: 'loading',
      text1: title,
      text2: message,
      position: 'top',
      topOffset: 50,
      autoHide: false,
    });
  },

  hideLoading: () => {
    if (loadingToastId) {
      Toast.hide();
      loadingToastId = null;
    }
  },
  
  confirm: (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void,
    extraProps?: { confirmText?: string; cancelText?: string }
  ) => {
    Toast.show({
      type: 'confirm',
      position: 'top',
      autoHide: false,
      text1: title,   
      text2: message, 
      props: {
        onConfirm,
        onCancel,
        ...extraProps,
      },
    });
  },
};

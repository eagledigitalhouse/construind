import toast from 'react-hot-toast';

// Funções simplificadas para toast
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #10b981',
        borderRadius: '8px',
        fontSize: '14px',
        padding: '12px 16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff'
      }
    });
  },
  
  error: (message: string) => {
    toast.error(message);
  },
  
  info: (message: string) => {
    toast(message, {
      icon: 'i',
      style: {
        border: '1px solid #3b82f6',
        background: '#eff6ff'
      }
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      icon: '!',
      style: {
        border: '1px solid #f59e0b',
        background: '#fffbeb'
      }
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message);
  },
  
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }
};

// Exportar o toast original para casos especiais
export { toast };
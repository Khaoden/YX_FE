import axios from './axios';

// 获取头像URL
export const getAvatar = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}/avatar`);
    return response.data?.avatarUrl || null;
  } catch (error) {
    console.error('Get avatar error:', error);
    throw error;
  }
};

// 构建头像完整URL
export const getAvatarUrl = (filename) => {
  if (!filename) return null;
  // 如果已经是完整的URL，直接返回
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  // 构建访问 FileController 的完整URL
  return `${import.meta.env.VITE_API_BASE_FILE_URL}${filename}`;
};

export const uploadAvatar = async (userId, formData) => {
  try {
    console.log('Uploading avatar for user:', userId);
    console.log('FormData contents:', Array.from(formData.entries()));
    
    const response = await axios.post(
      `/users/${userId}/profile/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('Upload progress:', percentCompleted);
        },
      }
    );
    
    console.log('Upload response:', response);
    
    return {
      data: {
        avatarUrl: response.data.url || response.data.avatarUrl || response.data.path
      }
    };
  } catch (error) {
    console.error('Upload avatar error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// 添加通用文件上传函数
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// 构建旧物图片完整URL
export const getUsedItemImageUrl = (filename) => {
  if (!filename) return null;
  
  // 如果已经是完整的URL，直接返回
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // 如果是API路径，处理成完整URL
  if (filename.startsWith('/api/')) {
    return `${import.meta.env.VITE_API_BASE_URL}${filename.substring(4)}`;
  }

  // 如果是 /images 开头的路径
  if (filename.startsWith('/images/')) {
    return `${import.meta.env.VITE_API_BASE_URL}/files/used-items${filename}`;
  }
  
  // 其他情况，拼接完整URL
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${import.meta.env.VITE_API_BASE_URL}/files/used-items/${cleanFilename}`;
};
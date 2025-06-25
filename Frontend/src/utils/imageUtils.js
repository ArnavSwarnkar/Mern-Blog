// utils/imageUtils.js
export const getImageUrl = (imagePath, type = 'storyImages') => {
  if (!imagePath) {
    return type === 'userPhotos' ? '/default-avatar.png' : '/default-story.png';
  }
  
  // In development, use relative URLs (proxy will handle it)
  // In production, use full backend URL
  if (process.env.NODE_ENV === 'development') {
    return `/${type}/${imagePath}`;
  } else {
    // For production, use your deployed backend URL
    const backendUrl = process.env.REACT_APP_API_URL || 'https://your-backend-url.com';
    return `${backendUrl}/${type}/${imagePath}`;
  }
};

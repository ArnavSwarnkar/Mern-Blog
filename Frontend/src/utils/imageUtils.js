// utils/imageUtils.js
export const getImageUrl = (imagePath, type = 'storyImages') => {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : '';
  return `${baseUrl}/${type}/${imagePath}`;
};

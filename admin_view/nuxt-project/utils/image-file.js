export const convertImageToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result);
      } else {
        reject(new Error("Failed to convert image to Data URL"));
      }
    };
    reader.onerror = (event) => {
      reject(event);
    };
    reader.readAsDataURL(file);
  });
};

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

export const uploadImageToImgur = async (
  dataUrl,
  imgurClientId,
  options = {}
) => {
  if (!imgurClientId) {
    throw new Error(
      options.missingClientIdMessage || "Imgur Client ID is not configured"
    );
  }

  const base64 = dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64 }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.link;
  } catch (error) {
    console.error("Imgur upload error:", error);
    throw error;
  }
};

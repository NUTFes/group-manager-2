export const uploadImageToImgur = async (
  file,
  imgurClientId,
  options = {}
) => {
  if (!imgurClientId) {
    throw new Error(
      options.missingClientIdMessage || "Imgur Client ID is not configured"
    );
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "file");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
      },
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      link: data.data.link,
      deletehash: data.data.deletehash,
    };
  } catch (error) {
    console.error("Imgur upload error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

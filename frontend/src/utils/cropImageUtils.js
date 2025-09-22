// cropImageUtils.js
export const getCroppedImg = (imageSrc, cropAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement("canvas")

      // 👇 Instagram style square (fixed size)
      const size = 400
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext("2d")

      ctx.drawImage(
        image,
        cropAreaPixels.x,
        cropAreaPixels.y,
        cropAreaPixels.width,
        cropAreaPixels.height,
        0,
        0,
        size,
        size
      )

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        const fileUrl = URL.createObjectURL(blob)
        resolve(fileUrl)
      }, "image/jpeg")
    }
    image.onerror = reject
  })
}

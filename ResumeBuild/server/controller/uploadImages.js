// Image upload feature removed
export const uploadResumeImages = async (_req, res) => {
  return res.status(410).json({
    success: false,
    message: "Image upload feature has been removed",
  });
};

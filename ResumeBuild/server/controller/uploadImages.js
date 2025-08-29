import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

export const uploadResumeImages = async (req, res) => {
  try {
    
    const uploadHandler = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "profileImage", maxCount: 1 },
    ]);

    uploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { id } = req.params;

      const resume = await Resume.findOne({
        _id: id,
        userId: req.user._id,
      });

      if (!resume) {
        return res
          .status(404)
          .json({ success: false, message: "Resume not found" });
      }

      const uploadsFolder = path.join(process.cwd(), "uploads");
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files?.thumbnail ? req.files.thumbnail[0] : null;
      const newProfileImage = req.files?.profileImage ? req.files.profileImage[0] : null;

      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(
            uploadsFolder,
            path.basename(resume.thumbnailLink)
          );
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }

        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(
            uploadsFolder,
            path.basename(resume.profileInfo.profilePreviewUrl)
          );
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }

        if (!resume.profileInfo) resume.profileInfo = {};
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();

      res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: resume,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

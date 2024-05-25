// src/controllers/imageUploadController.ts
import { Request, Response } from "express";
import multer from "multer";
import axios from "axios";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = [
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    try {
      const formData = new FormData();
      formData.append("image", req.file.buffer.toString("base64"));

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData,
        {
          params: {
            key: "YOUR_IMGBB_API_KEY",
          },
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      res.json({ url: response.data.data.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  },
];

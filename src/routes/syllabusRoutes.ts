import express from "express";
import { Request, Response } from "express";
import Syllabus from "../models/Syllabus";
import authMiddleware from "../middleware/authMiddleware";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const router = express.Router();

router.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access!" });
    }

    const { courseName, courseCode, syllabus } = req.body;

    if (!courseName || !courseCode || !syllabus || !Array.isArray(syllabus)) {
      return res.status(400).json({ message: "Invalid input data. Please provide courseName, courseCode, and syllabus (array)." });
    }

    const existingSyllabus = await Syllabus.findOne({ user: req.user.id, courseCode });
    if (existingSyllabus) {
      return res.status(400).json({ message: "Syllabus for this course code already exists!" });
    }

    const newSyllabus = new Syllabus({
      user: req.user.id,
      courseName,
      courseCode,
      syllabus,
    });

    await newSyllabus.save();
    return res.status(201).json({ message: "Syllabus saved successfully!", syllabus: newSyllabus });

  } catch (error) {
    console.error("Error saving syllabus:", error);
    return res.status(500).json({ message: "Internal server error while saving syllabus!", error });
  }
});

// Endpoint to fetch all courses
router.get("/courses", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const courses = await Syllabus.find({ user: req.user.id }).select("courseName courseCode");
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Internal server error while fetching courses!", error });
  }
});

// Endpoint to fetch syllabus topics for a specific course
router.get("/syllabus/:courseCode", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseCode } = req.params;
    const syllabus = await Syllabus.findOne({ user: req.user.id, courseCode }).select("syllabus");
    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found!" });
    }
    return res.status(200).json(syllabus.syllabus);
  } catch (error) {
    console.error("Error fetching syllabus topics:", error);
    return res.status(500).json({ message: "Internal server error while fetching syllabus topics!", error });
  }
});

export default router;
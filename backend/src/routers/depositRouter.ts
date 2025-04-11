import express from "express";
import { protect } from "../middlewares/auth";
import { generateDepositAddress } from "../controllers/depositController";

const router = express.Router();

router.use(protect);

router.post("/generate", generateDepositAddress);

export default router;

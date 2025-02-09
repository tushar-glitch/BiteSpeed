import express from 'express';
const router = express.Router();
import { identify } from '../controllers/contactController';


router.post('/identify', identify);

export default router;
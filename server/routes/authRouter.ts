import express from 'express';
import authController from '../controllers/authController';
import { validRegister } from '../middleware/valid';

const router = express.Router();

//Routes for Auhtentication
router.post('/register',validRegister, authController.register);


export default router;


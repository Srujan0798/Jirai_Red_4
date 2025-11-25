import { Router } from 'express';
import { getBoards, createBoard } from '../controllers/boardController';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createBoardSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.string().optional(),
  }),
});

router.get('/', getBoards);
router.post('/', validate(createBoardSchema), createBoard);

export default router;

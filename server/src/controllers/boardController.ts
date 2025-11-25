import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getBoards = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany();
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const board = await prisma.board.create({
      data: { title, description, type },
    });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board' });
  }
};

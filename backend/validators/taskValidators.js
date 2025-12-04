import { body, query } from 'express-validator';

export const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be either Pending or Completed'),
];

export const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Pending', 'Completed'])
    .withMessage('Status must be either Pending or Completed'),
];

export const taskQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['Pending', 'Completed', 'all'])
    .withMessage('Status filter must be Pending, Completed, or all'),
];

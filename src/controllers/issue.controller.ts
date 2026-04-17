import { Request, Response, NextFunction } from 'express';
import { body, param, ValidationChain }    from 'express-validator';
import * as issueService                   from '../services/issue.service';
import { sendSuccess }                     from '../utils/response';

// ---- Validation rule chains ----

export const createRules: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 255 }).withMessage('Title must be 255 characters or fewer.'),
  body('description').optional({ nullable: true }).isString(),
  body('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status.'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority.'),
  body('severity')
    .optional({ nullable: true })
    .isIn(['Minor', 'Major', 'Critical'])
    .withMessage('Invalid severity.'),
];

export const updateRules: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('status')
    .optional()
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status.'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority.'),
  body('severity')
    .optional({ nullable: true })
    .isIn(['Minor', 'Major', 'Critical'])
    .withMessage('Invalid severity.'),
];

export const statusRules: ValidationChain[] = [
  body('status')
    .notEmpty().withMessage('Status is required.')
    .isIn(['Open', 'In Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status.'),
];

export const idParam: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid issue ID.'),
];

// ---- Handlers ----

export async function listIssues(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await issueService.getIssues(req.query as Record<string, string>);
    sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issue = await issueService.getIssueById(req.params['id']!);
    sendSuccess(res, { issue });
  } catch (err) { next(err); }
}

export async function createIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issue = await issueService.createIssue({ ...req.body, created_by: req.user!.id });
    sendSuccess(res, { issue }, 'Issue created successfully.', 201);
  } catch (err) { next(err); }
}

export async function updateIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issue = await issueService.updateIssue(req.params['id']!, req.body);
    sendSuccess(res, { issue }, 'Issue updated successfully.');
  } catch (err) { next(err); }
}

export async function patchStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issue = await issueService.updateIssueStatus(req.params['id']!, req.body.status);
    sendSuccess(res, { issue }, 'Issue status updated.');
  } catch (err) { next(err); }
}

export async function deleteIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await issueService.deleteIssue(req.params['id']!);
    sendSuccess(res, null, 'Issue deleted successfully.');
  } catch (err) { next(err); }
}

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const counts = await issueService.getIssueCounts();
    sendSuccess(res, { counts });
  } catch (err) { next(err); }
}

export async function exportJson(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issues = await issueService.exportIssues(req.query as Record<string, string>);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="issues.json"');
    res.status(200).json(issues);
  } catch (err) { next(err); }
}

export async function exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const issues = await issueService.exportIssues(req.query as Record<string, string>);

    const headers = ['id', 'title', 'status', 'priority', 'severity', 'creator_name', 'assignee_name', 'created_at', 'updated_at'];
    const escape  = (val: unknown) => val == null ? '' : `"${String(val).replace(/"/g, '""')}"`;
    const rows    = issues.map((issue) => headers.map((h) => escape((issue as Record<string, unknown>)[h])).join(','));
    const csv     = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="issues.csv"');
    res.status(200).send('\uFEFF' + csv);
  } catch (err) { next(err); }
}

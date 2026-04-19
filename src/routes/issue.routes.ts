import { Router } from 'express';
import * as ctrl from '../controllers/issue.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats/counts', ctrl.getStats);
router.get('/export/json', ctrl.exportJson);
router.get('/export/csv', ctrl.exportCsv);

// CRUD
router.get('/', ctrl.listIssues);
router.post('/', ctrl.createRules, validate, ctrl.createIssue);

router.get('/:id', ctrl.idParam, validate, ctrl.getIssue);
router.put('/:id', ctrl.idParam, ctrl.updateRules, validate, ctrl.updateIssue);
router.patch('/:id/status', ctrl.idParam, ctrl.statusRules, validate, ctrl.patchStatus);
router.delete('/:id', ctrl.idParam, validate, ctrl.deleteIssue);

export default router;

import { Issue, IssueStatus, IssuePriority, IssueSeverity } from '../models/issue.model';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { FilterQuery } from 'mongoose';
import { IIssue } from '../models/issue.model';

interface IssueQuery {
  page?:     string;
  limit?:    string;
  search?:   string;
  status?:   string;
  priority?: string;
  severity?: string;
}

interface CreateIssueInput {
  title:       string;
  description?: string;
  status?:      IssueStatus;
  priority?:    IssuePriority;
  severity?:    IssueSeverity | null;
  created_by:   string;
  assigned_to?: string | null;
}

interface UpdateIssueInput {
  title?:       string;
  description?: string;
  status?:      IssueStatus;
  priority?:    IssuePriority;
  severity?:    IssueSeverity | null;
  assigned_to?: string | null;
}

function buildFilter(query: IssueQuery): FilterQuery<IIssue> {
  const filter: FilterQuery<IIssue> = {};

  if (query.search)   filter['$text'] = { $search: query.search };
  if (query.status   && ['Open', 'In Progress', 'Resolved', 'Closed'].includes(query.status))
    filter['status']   = query.status as IssueStatus;
  if (query.priority && ['Low', 'Medium', 'High', 'Critical'].includes(query.priority))
    filter['priority'] = query.priority as IssuePriority;
  if (query.severity && ['Minor', 'Major', 'Critical'].includes(query.severity))
    filter['severity'] = query.severity as IssueSeverity;

  return filter;
}

// Populate creator and assignee names in one reusable helper
const POPULATE = [
  { path: 'created_by',  select: 'name email' },
  { path: 'assigned_to', select: 'name email' },
];

// Flatten populated fields to match what the frontend expects
function formatIssue(doc: IIssue & { created_by?: unknown; assigned_to?: unknown }) {
  const obj = doc.toJSON() as Record<string, unknown>;

  // Flatten nested user objects → flat name fields
  const creator  = obj['created_by'] as ({ name?: string; id?: string } | null);
  const assignee = obj['assigned_to'] as ({ name?: string; id?: string } | null);

  obj['creator_name']  = creator?.name  ?? null;
  obj['assignee_name'] = assignee?.name ?? null;
  obj['created_by']    = creator?.id    ?? obj['created_by'];
  obj['assigned_to']   = assignee?.id   ?? null;

  // Map Mongoose timestamps to snake_case for frontend compatibility
  obj['created_at'] = (doc as IIssue & { createdAt?: Date }).createdAt?.toISOString();
  obj['updated_at'] = (doc as IIssue & { updatedAt?: Date }).updatedAt?.toISOString();
  delete obj['createdAt'];
  delete obj['updatedAt'];

  return obj;
}

// ------------------------------------------------------------------ //
//  LIST
// ------------------------------------------------------------------ //
export async function getIssues(query: IssueQuery) {
  const { page, limit, skip } = parsePagination(query as Record<string, string>);
  const filter = buildFilter(query);

  const [total, docs] = await Promise.all([
    Issue.countDocuments(filter),
    Issue.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  return {
    issues:     docs.map(formatIssue),
    pagination: buildPaginationMeta(total, page, limit),
  };
}

// ------------------------------------------------------------------ //
//  SINGLE
// ------------------------------------------------------------------ //
export async function getIssueById(id: string) {
  const doc = await Issue.findById(id).populate(POPULATE);
  if (!doc) throw Object.assign(new Error('Issue not found.'), { statusCode: 404 });
  return formatIssue(doc);
}

// ------------------------------------------------------------------ //
//  CREATE
// ------------------------------------------------------------------ //
export async function createIssue(input: CreateIssueInput) {
  const doc = await Issue.create({
    title:       input.title,
    description: input.description ?? null,
    status:      input.status      ?? 'Open',
    priority:    input.priority    ?? 'Medium',
    severity:    input.severity    ?? null,
    created_by:  input.created_by,
    assigned_to: input.assigned_to ?? null,
  });
  return getIssueById(doc._id.toString());
}

// ------------------------------------------------------------------ //
//  UPDATE
// ------------------------------------------------------------------ //
export async function updateIssue(id: string, input: UpdateIssueInput) {
  const doc = await Issue.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).populate(POPULATE);

  if (!doc) throw Object.assign(new Error('Issue not found.'), { statusCode: 404 });
  return formatIssue(doc);
}

// ------------------------------------------------------------------ //
//  PATCH STATUS
// ------------------------------------------------------------------ //
export async function updateIssueStatus(id: string, status: IssueStatus) {
  const doc = await Issue.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  ).populate(POPULATE);

  if (!doc) throw Object.assign(new Error('Issue not found.'), { statusCode: 404 });
  return formatIssue(doc);
}

// ------------------------------------------------------------------ //
//  DELETE
// ------------------------------------------------------------------ //
export async function deleteIssue(id: string) {
  const doc = await Issue.findByIdAndDelete(id);
  if (!doc) throw Object.assign(new Error('Issue not found.'), { statusCode: 404 });
}

// ------------------------------------------------------------------ //
//  STATS
// ------------------------------------------------------------------ //
export async function getIssueCounts() {
  const rows = await Issue.aggregate<{ _id: string; count: number }>([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = {
    Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0, total: 0,
  };

  for (const row of rows) {
    counts[row._id]  = row.count;
    counts['total'] += row.count;
  }

  return counts;
}

// ------------------------------------------------------------------ //
//  EXPORT (all matching, no pagination)
// ------------------------------------------------------------------ //
export async function exportIssues(query: IssueQuery) {
  const filter = buildFilter(query);
  const docs   = await Issue.find(filter).populate(POPULATE).sort({ createdAt: -1 });
  return docs.map(formatIssue);
}

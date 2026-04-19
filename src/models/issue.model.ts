import mongoose, { Document, Schema, Types } from 'mongoose';

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueSeverity = 'Minor' | 'Major' | 'Critical';

export interface IIssue extends Document {
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity | null;
  created_by: Types.ObjectId;
  assigned_to: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    severity: {
      type: String,
      enum: ['Minor', 'Major', 'Critical', null],
      default: null,
    },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = (ret['_id'] as { toString(): string }).toString();
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Text index for fast title search
issueSchema.index({ title: 'text' });
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ severity: 1 });

export const Issue = mongoose.model<IIssue>('Issue', issueSchema);

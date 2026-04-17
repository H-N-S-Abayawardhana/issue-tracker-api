import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name:          string;
  email:         string;
  password_hash: string;
  createdAt:     Date;
  updatedAt:     Date;
}

const userSchema = new Schema<IUser>(
  {
    name:          { type: String, required: true, trim: true, maxlength: 100 },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
  },
  {
    timestamps: true,
    // Transform _id → id and remove __v in every JSON response
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = (ret['_id'] as { toString(): string }).toString();
        delete ret['_id'];
        delete ret['__v'];
        delete ret['password_hash'];
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>('User', userSchema);

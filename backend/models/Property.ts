import { Schema, model, models } from 'mongoose';
import { IProperty } from '../../interfaces';

const PropertySchema = new Schema<IProperty>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  values: [String],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Porperty || model<IProperty>('Property', PropertySchema);

import { Schema, model, models } from 'mongoose';
import { ITemplate } from '../../interfaces';
import Property from './Property';

const TemplateSchema = new Schema<ITemplate>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  properties: [Property.schema],
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Template || model<ITemplate>('Template', TemplateSchema);

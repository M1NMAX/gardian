import { Schema, model, models } from 'mongoose';
import { IItem, IItemProperty } from '../../interfaces';

const ItemPropertySchema = new Schema<IItemProperty>({
  value: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
  },
  properties: [ItemPropertySchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Item || model<IItem>('Item', ItemSchema);

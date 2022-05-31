import { Schema, model, models } from 'mongoose';
import { ICollection } from '../../interfaces';
import Template from './Template';
import Item from './Item';

const CollectionSchema = new Schema<ICollection>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, 'The cannot be more than 40 characters']
    },
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    template: {
        type: Template.schema
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
export default models.Collection || model<ICollection>('Collection', CollectionSchema);
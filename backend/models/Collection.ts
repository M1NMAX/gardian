import { Schema, model, models } from 'mongoose';
import { CollectionInterface } from '../../interfaces';

const CollectionSchema = new Schema<CollectionInterface>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, 'The cannot be more than 40 characters']
    },
    owner_id: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
})
export default models.Collection || model<CollectionInterface>('Collection', CollectionSchema);
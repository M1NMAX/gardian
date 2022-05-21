import { Schema, model, models } from 'mongoose';
import { IGroup } from '../../interfaces';

const GroupSchema = new Schema<IGroup>({
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
    collections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Collection'
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
})
export default models.Group || model<IGroup>('Group', GroupSchema);
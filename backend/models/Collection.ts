import { Schema, model, models } from 'mongoose';
import { CollectionInterface } from '../../interfaces';

const CollectionSchema = new Schema<CollectionInterface>({
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
    variant: {
        type: String,
        required: true,
    },
    isSub: {
        type: Boolean,
        required: true
    },
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    },
    description: {
        type: String,
        default: ""
    },
    isDescriptionHidden: {
        type: Boolean,
        default: false,
    },
    properties: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },

            values: [{
                type: String,
                required: true,
            }]
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
export default models.Collection || model<CollectionInterface>('Collection', CollectionSchema);
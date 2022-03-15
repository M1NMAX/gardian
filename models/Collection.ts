import { Schema, model, models } from 'mongoose';

interface Collection {
    name: string;
    updatedAt?: Date;
    createdAt?: Date;
}

const CollectionSchema = new Schema<Collection>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, 'The cannot be more than 40 characters']
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
export default models.Collection || model<Collection>('Collection', CollectionSchema);
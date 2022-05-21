import { Schema, model, models } from 'mongoose';
import { IItem } from '../../interfaces';

const ItemSchema = new Schema<IItem>({
    name: {
        type: String,
        required: true
    },

    value: {
        type: String,
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


export default models.Item || model<IItem>('Item', ItemSchema);
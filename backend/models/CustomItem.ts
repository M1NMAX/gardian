import { Schema, model, models } from "mongoose";
import { CustomItemInterface } from "../../interfaces";

const CustomItemSchema = new Schema<CustomItemInterface>({
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
    collectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    },
    properties: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type:String,
            }
        }
    ]
    ,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }

});

export default models.CustomItem || model<CustomItemInterface>('CustomItem', CustomItemSchema);
import { Schema, model, models } from "mongoose";
import { EventInterface } from "../../interfaces";

const EventSchema = new Schema<EventInterface>({
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
    date: {
        type: String,
    },
    time: {
        type: String
    },
    description: {
        type: String,
    },
    reminder: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
});

export default models.Event || model<EventInterface>('Event', EventSchema);
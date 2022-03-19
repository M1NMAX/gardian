import { Schema, model, models } from "mongoose";
import { TodoInterface } from "../../interfaces";


const TodoSchema = new Schema<TodoInterface>({
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
    isConcluded: {
        type: Boolean,
        default: false,
    },
    conclusionDate: {
        type: String
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
export default models.Todo || model<TodoInterface>('Todo', TodoSchema);
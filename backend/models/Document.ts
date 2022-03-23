import { Schema, model, models } from "mongoose";
import { DocumentInterface } from "../../interfaces";

const DocumentSchema = new Schema<DocumentInterface>({
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
    content: {
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

});

export default models.Document || model<DocumentInterface>('Document', DocumentSchema);
import { Schema, model, models } from 'mongoose';
import { IProperty, ITemplate } from '../../interfaces';


const PropertySchema = new Schema<IProperty>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    values: [String]
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


const TemplateSchema = new Schema<ITemplate>({
    name: {
        type: String,
        required: true,
    },
    properties: [PropertySchema],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,

    }
});

export default models.Template || model<ITemplate>('Template', TemplateSchema);
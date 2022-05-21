import { Schema, model, models } from 'mongoose';
import { ICollection, IItem, IProperty, ITemplate } from '../../interfaces';


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


const ItemSchama = new Schema<IItem>({
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

const CollectionSchema = new Schema<ICollection>({
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
    description: {
        type: String,
        default: ""
    },
    template: {
        type: TemplateSchema
    },
    items: [ItemSchama],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
export default models.Collection || model<ICollection>('Collection', CollectionSchema);
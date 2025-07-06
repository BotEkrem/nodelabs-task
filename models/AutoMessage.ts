import {Schema, model, Document, Types} from 'mongoose';

export interface IAutoMessage extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    content: string;
    sendDate: Date;
    isQueued: boolean;
    isSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const autoMessageSchema = new Schema<IAutoMessage>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        sendDate: {
            type: Date,
            required: true,
        },
        isQueued: {
            type: Boolean,
            default: false,
        },
        isSent: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

export const AutoMessage = model<IAutoMessage>('AutoMessage', autoMessageSchema);
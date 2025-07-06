import {Schema, model, Document} from 'mongoose';
import * as argon2 from "argon2";

export interface IUser extends Document {
    username: string;
    password: string;
    loginAt?: Date;
    loginIP?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: {type: String, required: true, unique: true, trim: true},
        password: {type: String, required: true},
        loginAt: {type: Date},
        loginIP: {type: String},
    },
    {timestamps: true}
);

userSchema.pre('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        user.password = await argon2.hash(user.password);
        next();
    } catch (err) {
        next(err as Error);
    }
});

export const User = model<IUser>('User', userSchema);
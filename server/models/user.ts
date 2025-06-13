import mongoose, { Document, Schema } from 'mongoose';
interface IUser extends Document {
  username: string;
  password: string;
  progress: number;
};


const UserSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    progress: { type: Number, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export const User = mongoose.model('User', userSchema);

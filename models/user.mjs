
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: String,
    mobile: Number,
    id: Number
});

export default model('User', userSchema);

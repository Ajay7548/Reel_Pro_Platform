import mongoose, { Schema,model,models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email:string,
    password:string,
    _id?:mongoose.Types.ObjectId,
    createdAt?: Date;        // Timestamp when the user was created
    updatedAt?: Date;        // Timestamp when the user was last updated
}

// Define the Mongoose schema for the user collection
const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true }, // Ensures email uniqueness
        password: { type: String, required: true },           // Stores hashed password
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Middleware to hash the password before saving a user document
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {  // Only hash password if modified
        this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds = 10
    }
    next(); // Move to the next middleware or save operation
});

// Create the User model, reusing an existing one if it already exists
const User = models?.User || model<IUser>("User", userSchema);

export default User
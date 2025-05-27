import mongoose from "mongoose";
const storySchema = new mongoose.Schema({
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Story = mongoose.model('Story', storySchema)
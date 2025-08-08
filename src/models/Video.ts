import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  duration: string;
  views: string;
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  duration: {
    type: String,
    required: true
  },
  views: {
    type: String,
    default: '0'
  },
  category: {
    type: String,
    required: true,
    enum: ['corporate', 'music', 'documentary', 'product', 'social', 'commercial']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IVideo>('Video', VideoSchema);
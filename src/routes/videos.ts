import express from 'express';
import Video from '../models/Video';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Get all videos (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let filter: any = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single video (public)
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create video (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, thumbnail, videoId, duration, views, category, featured } = req.body;

    const video = new Video({
      title,
      description,
      thumbnail,
      videoId,
      duration,
      views: views || '0',
      category,
      featured: featured || false
    });

    await video.save();
    res.status(201).json({ message: 'Video created successfully', video });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Video ID already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update video (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, thumbnail, videoId, duration, views, category, featured } = req.body;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail, videoId, duration, views, category, featured },
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video updated successfully', video });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete video (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
import mongoose from 'mongoose';

export const DEFAULT_RESUME_URL = 'https://drive.google.com/file/d/1enBo2Ozt8SKulZxdxmWDVa1Mf5PQOxAI/view?usp=sharing';

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'site_settings',
      unique: true,
      index: true,
    },
    resumeUrl: {
      type: String,
      default: DEFAULT_RESUME_URL,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;

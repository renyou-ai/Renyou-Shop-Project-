import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: String,

name: {
  type: String,
  required: true
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true
},

password: {
  type: String,
  required: true
},

  avatar: String,

  googleAccount: {
  type: Boolean,
  default: false
},

  role: {
  type: String,
  enum: [
    "user",
    "Super Admin",
    "Pharmacist",
    "Marketing",
    "Support"
  ],
  default: "user"
},

  department: String,

  initials: String,

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  },

  lastActive: {
    type: Date,
    default: Date.now
  },

  settings: {
    currency: { type: String, default: "USD" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "UTC" },
    sidebarWidth: { type: String, default: "Normal" },
    themeColor: { type: String, default: "#524E8D" },

    notifications: {
      stockAlert: { type: Boolean, default: true },
      newOrder: { type: Boolean, default: true },
      newCustomer: { type: Boolean, default: false },
      promotionEnd: { type: Boolean, default: true }
    },

    security: {
      twoFactor: { type: Boolean, default: false },
      sessionTimeout: { type: String, default: "8h" },
      ipWhitelist: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// hash password
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // initials auto
  if (this.name && (this.isModified("name") || !this.initials)) {
    const parts = this.name.trim().split(/\s+/);
    this.initials =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : this.name.slice(0, 2).toUpperCase();
  }

  next();
});

userSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
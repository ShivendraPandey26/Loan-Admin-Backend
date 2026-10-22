import mongoose from "mongoose";
import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email address",
      ],
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "password should contain more than 6 character"],
      select: false,
    },

    role: {
      type: String,
      enum: ["Admin", "Viewer"],
      required: true,
      default: "Viewer",
    },
  },
  {
    timestamps: true,
  },
);

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) {
//     return;
//   }

//   const hash = await bcrypt.hash(this.password, 10);
//   this.password = hash;

//   return;
// });

// userSchema.methods.comparePassword = async function (password) {
//   console.log(password, this.password);

//   return await bcrypt.compare(password, this.password);
// };

const Account = mongoose.model("Account", accountSchema);

export default Account;

import { Schema } from "mongoose";
import { nanoid } from "nanoid";
import createModel from "@/lib/createModel";
import { IApp } from "@/interfaces/IApp";

const appSchema = new Schema<IApp>(
  {
    code: {
      type: String,
      unique: true,
      default: nanoid(12),
    },
    name: {
      type: String,
      maxLength: 20,
      required: [true, "Missing app name"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Missing user (userId)"],
    },
    description: {
      type: String,
      maxLength: 120,
      required: [true, "Missing app description"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    authorizedOrigins: {
      type: [String],
      validate: {
        validator: function (origins: string[]) {
          return (
            origins.length > 0 &&
            origins.every((origin) => /^(https?:\/\/[^/]+)$/.test(origin))
          );
        },
        message: () =>
          `Invalid origin: URIs must not contain a path or end with "/".`,
      },
    },
    commentStyles: {
      type: String,
      /** @todo Add json validator */
      default: "{}",
    },
  },
  {
    timestamps: true,
  }
);

const App = createModel<IApp>("App", appSchema);

export default App;
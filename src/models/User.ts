import { ObjectId } from "mongodb";
import { Model, Schema, Types, model } from "mongoose";
// export const emailIsUnique = {
//   async validator(email: string): Promise<boolean> {
//     const model = this.constructor as Model<IUser>;
//     const user = await model.exists({ email }).exec();

//     return user === null || this.get("_id").equals(user._id);
//   },
//   message: "ALREADY_USED_EMAIL",
// };
const schema = new Schema<IUser, Model<IUser>, IUser>(
  {
    name: String,
    email: {
      type: String,
      // validate: [emailIsUnique],
      required: [true, "User email required"],
    },
    password: String,
    phone: String,
    img: String,
    isVerified: { type: Boolean, default: false },
    code: String,
  },
  { timestamps: true }
);
schema.path("email").validate(async function (email) {
  // When running in `validate()` or `validateSync()`, the
  // validator can access the document using `this`.
  // When running with update validators, `this` is the Query,
  // **not** the document being updated!
  // Queries have a `get()` method that lets you get the
  // updated value.

  const model = this.constructor as Model<IUser>;
  const user = await model.exists({ email }).exec();

  return user === null || this.get("_id").equals(user._id);
}, "The specified email address is already in use.");
export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  img?: string;
  isVerified: boolean;
  code: string;
}
const User = model<IUser>("User", schema);
export default User;

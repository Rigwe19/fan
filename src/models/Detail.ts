import { ObjectId } from "mongodb";
import { Model, Schema, model } from "mongoose";

const schema = new Schema<IDetail, Model<IDetail>, IDetail>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    gender: String,
    marital: String,
    religion: String,
    description: { type: String, default: "" },
    dob: { type: String, default: "" },
    height: { type: String, default: "" },
    hobby: { type: [String], default: [] },
    interest: { type: [String], default: [] },
    fun_fact: { type: [String], default: [] },
    dp: { type: String, default: "" },
    location: { type: [String], default: [] },
    step: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export interface IDetail {
  user_id: ObjectId;
  gender: string;
  marital: string;
  religion: string;
  description?: string;
  dob?: string;
  height?: string;
  hobby?: string[];
  interest?: string[];
  fun_fact?: string[];
  dp?: string;
  location?: string;
  step: number;
}
const Detail = model<IDetail>("Detail", schema);
export default Detail;

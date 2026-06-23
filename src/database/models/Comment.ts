import { Schema, model, models, Model, Types } from "mongoose";

// Shape of a Comment document. createdAt comes from timestamps.
export interface IComment {
  productId: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>(
  {
    // Reference to the product this comment belongs to.
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El productId es requerido"],
    },
    content: { type: String, required: [true, "El contenido es requerido"] },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

const Comment: Model<IComment> =
  models.Comment || model<IComment>("Comment", commentSchema);

export default Comment;

// Service layer for product comments.

export interface Comment {
  _id?: string;
  productId: string;
  content: string;
  createdAt?: string;
}

// GET /api/products/:productId/comments
export const getComments = async (productId: string): Promise<Comment[]> => {
  const res = await fetch(`/api/products/${productId}/comments`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener comentarios");
  return json.data ?? [];
};

// POST /api/products/:productId/comments
export const createComment = async (
  productId: string,
  content: string
): Promise<Comment> => {
  const res = await fetch(`/api/products/${productId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear comentario");
  return json.data;
};

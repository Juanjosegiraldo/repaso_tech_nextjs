// Service layer for products: the views go through here, never fetch directly.

export interface Product {
  _id?: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  currency: "COP" | "USD";
}

const BASE_URL = "/api/products";

// GET /api/products -> list of products.
export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener productos");
  return json.data ?? [];
};

// POST /api/products -> create a product.
export const createProduct = async (data: Product): Promise<Product> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear producto");
  return json.data;
};

// PUT /api/products/:id -> update a product (partial fields).
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al actualizar producto");
  return json.data;
};

// DELETE /api/products/:id -> delete a product.
export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al eliminar producto");
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/authService";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";

// Empty form template.
const EMPTY_FORM: Product = {
  sku: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  currency: "COP",
};

export default function ProductsPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadProducts = () => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  };

  // Session guard (any logged-in user), then initial load.
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    // Syncing client-only state (localStorage session) on mount is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(true);
    loadProducts();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // price and stock are numbers; the rest are strings.
    const parsed = name === "price" || name === "stock" ? Number(value) : value;
    setForm({ ...form, [name]: parsed });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  const handleEdit = (p: Product) => {
    setForm(p);
    setEditingId(p._id ?? null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  if (!allowed) return null;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Gestión de productos</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Create / edit form */}
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">
          {editingId ? "Editar producto" : "Crear producto"}
        </h2>
        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="category"
          placeholder="Categoría"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="price"
          type="number"
          min={0}
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="stock"
          type="number"
          min={0}
          step={1}
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option value="COP">COP</option>
          <option value="USD">USD</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            {editingId ? "Guardar cambios" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border px-4 py-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      {products.length === 0 ? (
        <p>No hay productos registrados. ¡Crea el primero!</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              name={p.name}
              price={p.price}
              stock={p.stock}
              currency={p.currency}
              onEdit={() => handleEdit(p)}
              onDelete={() => handleDelete(p._id ?? "")}
            />
          ))}
        </div>
      )}
    </main>
  );
}

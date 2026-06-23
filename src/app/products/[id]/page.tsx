"use client";

import { useEffect, useState } from "react";
// useParams reads the dynamic [id] segment on the client.
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProduct, Product } from "@/services/productService";
import { getComments, createComment, Comment } from "@/services/commentService";

export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const loadComments = (productId: string) => {
    getComments(productId).then(setComments).catch(() => setComments([]));
  };

  useEffect(() => {
    if (!id) return;
    // Both setState calls happen inside async callbacks (no cascading render).
    getProduct(id).then(setProduct).catch(() => setProduct(null));
    loadComments(id);
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createComment(id, content);
      setContent("");
      loadComments(id); // refresh history
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <Link href="/dashboard/products" className="text-sm text-blue-600 underline">
        ← Volver a productos
      </Link>

      {/* Product detail */}
      {!product ? (
        <p>Cargando producto...</p>
      ) : (
        <section className="rounded-lg border p-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">SKU: {product.sku}</p>
          <p className="text-gray-600">Categoría: {product.category}</p>
          <p className="text-gray-600">
            Precio: {product.price.toLocaleString()} {product.currency}
          </p>
          <p className="text-gray-600">Stock: {product.stock}</p>
        </section>
      )}

      {/* Comments */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Comentarios</h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            placeholder="Escribe un comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="flex-1 rounded border p-2"
          />
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Comentar
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-gray-500">Aún no hay comentarios.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((c) => (
              <li key={c._id} className="rounded border p-3">
                <p>{c.content}</p>
                {c.createdAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

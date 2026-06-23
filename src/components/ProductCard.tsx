// Reusable presentational component for a product.
// Receives DATA (name, price, stock, currency) and ACTIONS (onEdit, onDelete).
interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
  currency: "COP" | "USD";
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard = ({
  name,
  price,
  stock,
  currency,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  // Conditional style based on availability (stock > 0).
  const available = stock > 0;
  const cardStyle = available
    ? "border-green-500 bg-green-50"
    : "border-red-300 bg-red-50";
  const badgeStyle = available
    ? "bg-green-600 text-white"
    : "bg-red-600 text-white";

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${cardStyle}`}>
      <div>
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-gray-700">
          {price.toLocaleString()} {currency}
        </p>
        <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${badgeStyle}`}>
          {available ? `En stock: ${stock}` : "Agotado"}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

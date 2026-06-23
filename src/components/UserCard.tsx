// Reusable presentational component.
// Receives DATA (nombre, cc, email, role) and ACTIONS (onEdit, onDelete) via props.
interface UserCardProps {
  nombre: string;
  cc: string;
  email: string;
  role: "user" | "admin";
  onEdit: () => void;
  onDelete: () => void;
}

export const UserCard = ({
  nombre,
  cc,
  email,
  role,
  onEdit,
  onDelete,
}: UserCardProps) => {
  // Conditional style based on the role.
  const isAdmin = role === "admin";
  const cardStyle = isAdmin
    ? "border-purple-500 bg-purple-50"
    : "border-gray-300 bg-white";
  const badgeStyle = isAdmin
    ? "bg-purple-600 text-white"
    : "bg-gray-200 text-gray-700";

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${cardStyle}`}>
      <div>
        <h3 className="font-bold">{nombre}</h3>
        <p className="text-sm text-gray-600">CC: {cc}</p>
        <p className="text-sm text-gray-600">{email}</p>
        <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${badgeStyle}`}>
          {role}
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

import type { InventoryItem } from "../../../../types/general";

export default function InventoryView({ inventory }: { inventory: InventoryItem[] }) {
  return (
    <div>
      <h3>Inventory</h3>
      {inventory.map((item) => (
        <div key={item.id} title={item.name}>{item.name}</div>
      ))}
    </div>
  );
}
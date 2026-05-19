import type { EquipmentItem } from "../../../../types/general";

export default function EquipmentView({ equipment }: { equipment: EquipmentItem[] }) {
  return (
    <div>
      <h3>Equipment</h3>
      {equipment.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
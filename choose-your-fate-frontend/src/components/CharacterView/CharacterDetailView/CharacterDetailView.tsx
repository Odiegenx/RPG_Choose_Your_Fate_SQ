import { useEffect, useState } from "react";
import type { Props, InventoryItem, EquipmentItem } from "../../../types/general";
import { apiGet } from "../../../api/authApi";

import InventoryView from "./InventoryView/InventoryView";
import EquipmentView from "./EquipmentView/EquipmentView";

import "./CharacterDetailView.css";
import { useAuth } from "../../../context/AuthContext";

export default function CharacterDetailView({ character }: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [inventoryData, equipmentData] = await Promise.all([
          apiGet(`character/${character.id}/inventory`, {token: token}),
          apiGet(`character/${character.id}/equipment`, {token: token})
        ]);

        setInventory(inventoryData);
        setEquipment(equipmentData);

      } catch (err) {
        console.error(err);
        alert("Failed to load character details");
      } finally {
        setLoading(false);
      }
    }

    if (character?.id) {
      fetchData();
    }
  }, [character]);

  if (loading) {
    return <div>Loading character details...</div>;
  }

  return (
    <div
      id="vw-character-details"
      className="cw-container auto-width auto-height margin-top-bot-10 margin-left-5"
    >
        <div id="character-detail-grid" className="character-detail-grid-container-row">
            
            <div id="character-detail-grid-inventory-portrait" className="character-detail-grid-container-column">
                <div id="character-detail-grid-equip" className="border padding-right-20">
                    <EquipmentView equipment={equipment} />
                </div>
                <div id="character-detail-grid-portrait" className="border">
                    {character.name}
                </div>
            </div>

            <div id="character-detail-grid-inventory" className="border">
                <InventoryView inventory={inventory} />
            </div>
        </div>
    </div>
  );
}
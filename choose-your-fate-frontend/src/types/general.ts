export type User = {
  username: string;
};

export type Scene = {
  id: string;
  dialog: string[];
  img: string;
  choices: Choice[];
};

export type Choice = {
    id: string
    name: string
    destination_id: string    
};

export type Character = {
  id: string;
  accountId: string;
  chapterId: string;
  sceneId: string;
  raceDetailsId: string;
  name: string;
  flag: {};
};

export type CharacterStats = {
  intelligence: number;
  charisma: number;
  fashion: number;
};

export type CharacterView = {
  characterId: number;
  characterName: string;
  chapterId: number;
  chapterName: string;
  raceDetailsId: number;
  raceName: string;
  stats: CharacterStats;
};

export type CharacterViewResponse = {
  views: CharacterView[];
  canCreateMoreCharacters: boolean;
};

export type SelectedCharacter = Character | CharacterView;

export type Props = {
  character: Character;
};

export type CharacterWindowProps = {
  character: CharacterView;
  onSelect: (character: CharacterView) => void;
};

export type NewCharacterWindowProps = {
  onSelect: (createNew: SelectedCharacter) => void;
};

export type CharacterListProps = {
  onSelect: (character: SelectedCharacter) => void;
  refreshKey?: number;
}

export type NewCharacterViewProps = {
  character: Character;
  onCharacterCreated: () => void;
};

export type CharacterDetailViewProps = {
  character: CharacterView;
};

export type CharacterPathStoryProps = {
  character: CharacterView;
};

export type CharacterPath = {
  id: number;
  characterId: number;
  summary: string;
  audioBlob: string;
};

export type InventoryItem = {
  id: string;
  name: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
};

export type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
};

export type InventoryLoadoutItem = {
  inventoryId: number;
  amount: number;
  item: Item;
};

export type Loadout = {
  inventoryId: number;
  equippedItems: (Item | null)[];
  itemsInInventory: InventoryLoadoutItem[];
};

export type Racedetails = {
  id: string;
  name: string;
};

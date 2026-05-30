export type User = {
  username: string;
};

export type Scene = {
  id: string | number;
  dialog: string[];
  img: string;
  choices: Choice[];
};

export type Choice = {
    id: string | number
    name: string
    destination_id: string | number
};

export type Character = {
  id: number | "new-char";
  accountId: number | "";
  chapterId: number | "";
  sceneId: number | "";
  raceDetailsId: number | "";
  name: string;
  flag: string;
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
  summary: string | null;
  audioBlob: string | null;
};

export type AiResponse = {
  response: string;
};

export type SceneResponse = {
  id: string;
  chapterId: string;
  name: string;
};

export type ChoiceResponse = {
  id: string;
  destinationSceneId: string;
  sceneId: string;
  description: string;
  consequence: string;
  targetId: number | null;
  valueInt: number | null;
  requirements: string | null;
};

export type SceneLookaheadResponse = {
  scene: SceneResponse;
  choices: ChoiceResponse[];
  destinationScenes: SceneResponse[];
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

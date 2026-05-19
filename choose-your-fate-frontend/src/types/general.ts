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

export type Props = {
  character: Character;
};

export type CharacterWindowProps = {
  character: Character;
  onSelect: (character: Character) => void;
};

export type CharacterListProps = {
  onSelect: (character: Character) => void;
}

export type InventoryItem = {
  id: string;
  name: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
};
import type { Scene } from "../types/general";

export const scenes: Record<number, Scene> = {
  0: {
    id: 0,
    dialog: [
      "Dette er tekst",
      "Men det kunne også være noget andet",
      "Eller noget helt tredje."
    ],
    img: "/images/Welcome.png",
    choices: [
      { id: 0, name: "Go left", destination_id: 2 },
      { id: 1, name: "Go right", destination_id: 1 }
    ]
  },

  1: {
    id: 1,
    dialog: ["You went left.", "...", "Please leave."],
    img: "../images/Show.png",
    choices: [
      { id: 0, name: "Back", destination_id: 0 }
    ]
  },

  2: {
    id: 2,
    dialog: ["Illusion of choice...", "..."],
    img: "../images/ShowSecond.png",
    choices: [
      { id: 0, name: "Back", destination_id: 0 }
    ]
  }
};
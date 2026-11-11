export const initialMangas = [
  {
    id: "noragami",
    title: "Noragami",
    publisher: "Panini",
    format: "Tankōbon",
    publicationStatus: "completed",
    totalVolumes: 27,

    ownedVolumes: [
      ...Array.from({ length: 23 }, (_, index) => index + 1),
      27,
    ],

    coverColor: "#563D6D",
    coverLabel: "NORAGAMI",
  },

  {
    id: "dragon-ball",
    title: "Dragon Ball",
    publisher: "Panini",
    format: "Tankōbon",
    publicationStatus: "completed",
    totalVolumes: 42,

    ownedVolumes: Array.from(
      { length: 42 },
      (_, index) => index + 1
    ),

    coverColor: "#D58B19",
    coverLabel: "DRAGON BALL",
  },
];
const DEFAULT_KEYWORDS : string[] = [
    "attached",
    "attachment",
    "enclosed",
    "included",
    "pièce jointe",
    "pièce-jointe",
    "pj",
    "ci-joint",
    "document joint",
    "fichier joint",
    "inclus",
    "vous joins",
];

export const getKeywords = () : string[] => {
  let keywords = localStorage.getItem("keywords");
  if (keywords == null) {
      localStorage.setItem("keywords", JSON.stringify(DEFAULT_KEYWORDS));
      return DEFAULT_KEYWORDS;
  }
  else {
      return JSON.parse(keywords)
  }
}

export const setKeywords = (keywords:string[]) : void => {
    localStorage.setItem("keywords", JSON.stringify(keywords));
}
export interface CharacterCompatibility {
  id: number;
  name: string;
  compatibilityScores: {
    [character: string]: number;
  };
  explanation: {
    [key: string]: any;
  };
}

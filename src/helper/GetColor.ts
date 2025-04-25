export type StatKey =
  | "battles"
  | "winrate"
  | "damage"
  | "accuracy"
  | "survival";

type ColorConfig = {
  thresholds: number[];
  colors: string[];
};

type StatConfig = Record<StatKey, ColorConfig>;

export const getColor = (
  name: string = "Session",
  stat: StatKey,
  value: number
): string => {
  const defaultConfig: StatConfig = {
    battles: {
      thresholds: [1000, 5000, 20000],
      colors: ["grey", "green", "blue", "purple"],
    },
    winrate: {
      thresholds: [50, 60, 70],
      colors: ["grey", "green", "blue", "purple"],
    },
    damage: {
      thresholds: [2400, 2800, 3000],
      colors: ["grey", "green", "blue", "purple"],
    },
    accuracy: {
      thresholds: [80, 85, 90],
      colors: ["grey", "green", "blue", "purple"],
    },
    survival: {
      thresholds: [40, 50, 60],
      colors: ["grey", "green", "blue", "purple"],
    },
  };

  const sessionConfig: Partial<StatConfig> = {
    battles: {
      thresholds: [10, 20, 50, 100],
      colors: ["grey", "green", "blue", "purple"],
    },
  };

  const updateConfig: Partial<StatConfig> = {
    battles: {
      thresholds: [20, 50, 100],
      colors: ["green", "blue", "purple"],
    },
    winrate: {
      thresholds: [0, 100],
      colors: ["red", "green"],
    },
    damage: {
      thresholds: [0, 100],
      colors: ["red", "green"],
    },
    accuracy: {
      thresholds: [0, 100],
      colors: ["red", "green"],
    },
    survival: {
      thresholds: [0, 100],
      colors: ["red", "green"],
    },
  };

  let config: Partial<StatConfig> = { ...defaultConfig };

  if (["session", "сессия"].includes(name.toLowerCase())) {
    config = { ...config, ...sessionConfig };
  }
  if (["update", "апгрейд"].includes(name.toLowerCase())) {
    config = { ...config, ...updateConfig };
  }

  const statConfig = config[stat];
  if (!statConfig) return "grey";

  const { thresholds, colors } = statConfig;

  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) {
      return colors[i];
    }
  }

  return colors[colors.length - 1];
};

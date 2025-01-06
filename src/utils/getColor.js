export const getColor = (name = "Session", stat, value) => {
  const defaultConfig = {
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
  const sessionConfig = {
    battles: {
      thresholds: [10, 20, 50, 100],
      colors: ["grey", "green", "blue", "purple"],
    },
  };

  // Специфическая конфигурация для "Update"
  const updateConfig = {
    battles: { thresholds: [20, 50, 100], colors: ["green", "blue", "purple"] },
    winrate: { thresholds: [0, 100], colors: ["red", "green"] },
    damage: { thresholds: [0, 100], colors: ["red", "green"] },
    accuracy: { thresholds: [0, 100], colors: ["red", "green"] },
    survival: { thresholds: [0, 100], colors: ["red", "green"] },
  };
  let config = { ...defaultConfig }; // Копируем общую конфигурацию

  if (["Session", "Сессия"].includes(name)) {
    config = { ...config, ...sessionConfig }; // Добавляем/переопределяем для "Session"
  }
  if (["Update", "Апгрейд"].includes(name)) {
    config = { ...config, ...updateConfig }; // Добавляем/переопределяем для "Update"
  }

  // Получаем диапазоны и цвета для текущей статистики
  const statConfig = config[stat] || { thresholds: [], colors: ["grey"] };
  const { thresholds, colors } = statConfig;

  // Определяем цвет на основе значения
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) return colors[i];
  }
  return colors[colors.length - 1];
};

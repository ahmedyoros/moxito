import { COLORS } from "../themes/colors";

export const getModelImage = (index: number) => {
  switch (index) {
    case 0:
      return require("../assets/motos/moto-0.png");

    case 1:
      return require("../assets/motos/moto-1.png");

    case 2:
      return require("../assets/motos/moto-2.png");

    case 3:
      return require("../assets/motos/moto-3.png");

    default:
      return require("../assets/motos/moto-0.png");
  }
};

export const getModelColor = (index: number) => {
  switch (index) {
    case 0:
      return COLORS.blue;

    case 1:
      return COLORS.yellow;

    case 2:
      return COLORS.red;

    case 3:
      return COLORS.green;

    default:
      return COLORS.blue;
  }
};

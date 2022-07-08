export const getThemeStyle = (theme) => {
  switch (theme) {
    case "default":
      return {};
    case "militaryGreen":
      return { borderColor: "#008061", color: "#008061" };
    case "tradition":
      return { borderColor: "#0454f2", color: "#0454f2" };
    default:
      return {};
  }
};

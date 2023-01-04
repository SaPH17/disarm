export const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const toPascalCase = (text: string) => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

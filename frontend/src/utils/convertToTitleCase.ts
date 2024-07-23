export function ConvertToTitleCase(input) {
  // Split the input string by underscores
  const words = input.split("_");

  // Capitalize the first letter of each word and join them with spaces
  const titleCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return titleCased;
}

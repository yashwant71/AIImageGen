export function ConvertToTitleCase(input) {
  // Split the input string by underscores
  const words = input.split("_");

  // Capitalize the first letter of each word and join them with spaces
  const titleCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return titleCased;
}

export function FormatPayload(formPayload: Record<string, any>, type) {
  if (type == "withKeys") {
    const formattedData = {};
    for (const key in formPayload) {
      if (formPayload.hasOwnProperty(key)) {
        formattedData[key] = formPayload[key].value;
      }
    }
    return formattedData;
  } else {
    // currently is use
    const valuesArray: any[] = [];
    for (const key in formPayload) {
      // seed randomizing
      let value = formPayload[key].value;
      if (key === "seed" && formPayload[key].isRandomize) {
        value = Math.floor(Math.random() * (2147483647 + 1));
        console.log("ss", key);
      }
      if (formPayload.hasOwnProperty(key)) {
        valuesArray.push(value);
      }
      // for seed randomize
    }
    console.log("Values array from useFulFn:", valuesArray);
    return valuesArray;
  }
}

export function convertApiNameForUrlFormat(inputString) {
  // Split the input string by '/' and '.'
  const parts = inputString.split(/[/.]/);

  // Convert each part to lowercase and join them with '-'
  const convertedString = parts.map((part) => part.toLowerCase()).join("-");

  return convertedString;
}

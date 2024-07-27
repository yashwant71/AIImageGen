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
    const valuesArray: any[] = [];
    for (const key in formPayload) {
      if (formPayload.hasOwnProperty(key)) {
        valuesArray.push(formPayload[key].value);
      }
    }
    console.log("Values array:", valuesArray);
    return valuesArray;
  }
}

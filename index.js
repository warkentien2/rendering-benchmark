const Jimp = require("jimp");
const _ = require("lodash");
const fs = require("fs");

// Define the path and filename for the output file
const outputFilePath = "output.txt";

// Load the image
Jimp.read("Lena.png", (err, image) => {
  if (err) throw err;

  // Get the image width and height
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // Create a matrix to store the color information of each pixel
  let flatMatrix = [];

  // Set of unique colors
  let colors;

  // Style map
  let styleMap;

  // Loop through each pixel in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Get the color of the current pixel
      const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));

      // Add the color information to the current row of the matrix
      flatMatrix.push(`rgb(${r}, ${g}, ${b})`);
    }
  }

  // Populate list of unique colors
  colors = _.uniq(flatMatrix);

  // replace flatMatrix's colors with index of colors
  styleMap = Object.fromEntries(colors.map((color) => [color, []]));
  flatMatrix.forEach((color, index) => {
    styleMap[color].push(index);
  });

  const generateNthOfTypes = (object, type, selector) => {
    const nthOfTypes = object[type]
      .map((indexRef) => `${selector}:nth-of-type(${indexRef + 1})`)
      .join(", ");
    return nthOfTypes;
  };

  // Open the output file for writing
  const outputStream = fs.createWriteStream(outputFilePath);

  // Create stylesheet
  colors.forEach((color) => {
    outputStream.write(
      `${generateNthOfTypes(
        styleMap,
        color,
        "i"
      )} { background-color: ${color}; }`
    );
  });

  // Close the output stream
  outputStream.end();
});

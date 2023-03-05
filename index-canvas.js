const Jimp = require("jimp");
const fs = require("fs");

// Define the path and filename for the output file
const outputFilePath = "output-canvas.txt";

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
      flatMatrix.push(
        `ctx.fillStyle="#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}"\nctx.fillRect(${
          x * 2
        },${y * 2},2,2)\n`
      );
    }
  }

  // Open the output file for writing
  const outputStream = fs.createWriteStream(outputFilePath);

  // Create SVG
  outputStream.write(flatMatrix.join(""));

  //   add CSS:
  /*
rect {
    width: 2px;
    height: 2px;
    stroke: none;
}

*/

  // Close the output stream
  outputStream.end();
});

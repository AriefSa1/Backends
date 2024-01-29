// fileRemover.js
import fs from "fs";

const fileRemover = async (filenames) => {
  try {
    if (Array.isArray(filenames)) {
      // Iterate over the array of filenames and remove each file
      for (const filename of filenames) {
        fs.unlink(filename); // Use fs.unlink to remove the file
      }
    } else {
      fs.unlink(filenames); // Your existing logic for a single filename
    }
  } catch (error) {
    // Handle errors
    console.error(`Error removing file: ${error.message}`);
  }
};

export { fileRemover };

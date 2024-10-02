const fs = require("fs");
const wkhtmltopdf = require("wkhtmltopdf");
const path = require("path");
const { promisify } = require("util");

// Promisify fs.unlink for easier async/await usage
const unlinkAsync = promisify(fs.unlink);

const generateOfferLetter = async (req, res, next) => {
  try {
    // Read the HTML template from a file
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "..", "template", "offerLetterTemplate.html"),
      "utf8"
    );

    // Define the output PDF file path
    const outputFilePath = path.join(__dirname, "..", "offer_letter.pdf");

    // Generate PDF and write to the file
    await new Promise((resolve, reject) => {
      wkhtmltopdf(htmlTemplate, { output: outputFilePath })
        .on("error", (err) => {
          console.error("wkhtmltopdf error:", err);
          reject(err);
        })
        .on("end", () => resolve());
    });

    // Send the generated PDF as a response
    res.sendFile(outputFilePath, (err) => {
      if (err) return next(err);
      // Delete the file after sending it
      unlinkAsync(outputFilePath).catch((err) =>
        console.error("Failed to delete PDF file:", err)
      );
    });
  } catch (error) {
    console.error("Error in generating PDF:", error);
    next(error);
  }
};

module.exports = { generateOfferLetter };

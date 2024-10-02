const fs = require("fs");
const wkhtmltopdf = require("wkhtmltopdf");
const path = require("path");
const { promisify } = require("util");

// Promisify fs.unlink for easier async/await usage
const unlinkAsync = promisify(fs.unlink);

const generateOfferLetter = async (req, res, next) => {
  try {
    // Define the output PDF file path using the /tmp directory for Azure
    const outputFilePath = path.join("/tmp", "offer_letter.pdf");

    // Ensure the directory exists
    const directoryPath = path.dirname(outputFilePath);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Read the HTML template from a file
    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../template/offerLetterTemplate.html"),
      "utf8"
    );

    // Generate PDF from the HTML template
    await new Promise((resolve, reject) => {
      wkhtmltopdf(htmlTemplate, { output: outputFilePath })
        .on("error", (err) => {
          console.error("Error generating PDF:", err);
          reject(err);
        })
        .on("end", () => {
          console.log("PDF generated successfully at:", outputFilePath);
          resolve();
        });
    });

    // Check if the PDF file exists before sending it
    if (fs.existsSync(outputFilePath)) {
      console.log("File exists, sending:", outputFilePath);
      res.sendFile(outputFilePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }
        // Optionally delete the file after sending
        unlinkAsync(outputFilePath).catch((err) =>
          console.error("Failed to delete PDF file:", err)
        );
      });
    } else {
      console.error("PDF file not found:", outputFilePath);
      res.status(404).send("PDF file not found.");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { generateOfferLetter };

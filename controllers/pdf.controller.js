const path = require("path");
const fs = require("fs");
const wkhtmltopdf = require("wkhtmltopdf");

const generateOfferLetter = async (req, res, next) => {
  try {
    const tempDir = "/tmp";
    console.log("Using temp directory:", tempDir);

    // Ensure the temp directory is writable
    const testFilePath = path.join(tempDir, "test.txt");
    try {
      fs.writeFileSync(testFilePath, "Write test content");
      console.log(`Successfully wrote test file: ${testFilePath}`);
      fs.unlinkSync(testFilePath); // Clean up test file
    } catch (err) {
      console.error(`Failed to write to temp directory (${tempDir}).`, err);
      return res.status(500).send("Temp directory is not writable.");
    }

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../template/offerLetterTemplate.html"),
      "utf8"
    );

    const outputFilePath = path.join(tempDir, "offer_letter.pdf");

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

    // Add a short delay before checking for the PDF file
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the PDF exists before sending it
    if (fs.existsSync(outputFilePath)) {
      console.log("File exists, sending:", outputFilePath);
      res.sendFile(outputFilePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }
        // Optionally delete the file after sending
        fs.unlink(outputFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete PDF file:", unlinkErr);
          }
        });
      });
    } else {
      console.error("PDF file not found:", outputFilePath);
      res.status(404).send("PDF file not found.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

module.exports = { generateOfferLetter };

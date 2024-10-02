const generateOfferLetter = async (req, res, next) => {
  try {
    const outputFilePath = path.join("/tmp", "offer_letter.pdf");
    console.log("Output PDF Path:", outputFilePath); // Log the output file path

    // Ensure the directory exists
    const directoryPath = path.dirname(outputFilePath);
    if (!fs.existsSync(directoryPath)) {
      console.log("Creating directory:", directoryPath);
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../template/offerLetterTemplate.html"),
      "utf8"
    );

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
    console.error("Error occurred:", error); // Log any unexpected errors
    next(error);
  }
};

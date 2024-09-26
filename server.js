import express from "express";
import bodyParser from "body-parser";

import { deleteLocalFiles, filterImageFromURL } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
app.get("/filteredimage", async (req, res) => {
  try {
    const { image_url } = req.query;
    if (!image_url) {
      return res
        .status(400)
        .send({ message: "Invalid URL", code: "invalid_url" });
    }

    const imgExtensions = ["jpg", "jpeg", "png"];
    const extension = image_url.slice(-3).toLowerCase();

    if (imgExtensions.includes(extension)) {
      const filteredPath = await filterImageFromURL(image_url);

      res.sendFile(filteredPath, function (err) {
        if (err) {
          return res.status(500).send({
            message: "Error sending file - " + err,
            code: "sending_error",
          });
        } else {
          deleteLocalFiles([filteredPath]);
        }
      });
    } else {
      res.status(400).send({ message: "It is not image", code: "image_error" });
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send(
    "try GET /filteredimage?image_url={{}} and watch, then try to eb deploy"
  );
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});

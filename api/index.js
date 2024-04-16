import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/images/"); // Define your upload directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename without spaces
    const originalName = file.originalname;
    const sanitizedFilename = originalName.replace(/\s+/g, ''); // Remove spaces

    // Construct the filename using current timestamp and sanitized original filename
    const filename = Date.now() + "-" + sanitizedFilename;
    cb(null, filename);
  },
});


const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.filename; // Assuming the path is stored in req.file.path
    console.log(imageUrl);
    // Save imageUrl to your database or perform any necessary operations
    const { userId } = req.body;
    const updatedCruise = await prisma.cruises.update({
      where: {
        id: +userId, // Assuming userId is the ID of the cruise to update
      },
      data: {
        image: imageUrl, // Update the 'image' field with the new imageUrl
      },
    });
    console.log("Cruise updated with new image:", updatedCruise);

    // Respond with the imageUrl in the JSON response
    res
      .status(200)
      .json({ data: updatedCruise, msg: "Cruise Updated successfully." });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});
// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/profile", requireAuth, async (req, res) => {
  try {
    const data = await prisma.users.findUnique({
      where: {
        auth_id: req.auth.payload.sub,
      },
    });
    res
      .status(200)
      .json({ data: data, msg: "User profile fetched successfully." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/verify-user", requireAuth, async (req, res) => {
  try {
    console.log(req.auth);
    const auth_id = req.auth.payload.sub;
    const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}email`];
    const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}name`];
    const user = await prisma.users.findUnique({
      where: {
        auth_id,
        email,
      },
    });
    if (user) {
      res.status(200).json({ data: user, msg: "User login successfully." });
    } else {
      const newUser = await prisma.users.create({
        data: {
          email,
          auth_id,
          name,
        },
      });
      res.status(200).json({ data: newUser, msg: "User login successfully." });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/profile/:id", requireAuth, async (req, res) => {
  try {
    const isExist = await prisma.users.findFirst({
      where: {
        id: {
          not: +req.params.id,
        },
        email: req.body.email,
        mobile_number: req.body.mobile_number,
      },
    });
    console.log(isExist);
    if (isExist) {
      return await res
        .status(409)
        .json({ error: "Email or Mobile Number already exist." });
    }
    const data = await prisma.users.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    res
      .status(200)
      .json({ data: data, msg: "User profile updated successfully." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// get all cruise details
app.get("/cruise", async (req, res) => {
  try {
    const data = await prisma.cruises.findMany({});
    res.status(200).json({ data: data, msg: "Cruise fetched successfully." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/cruise/booking", requireAuth, async (req, res) => {
  try {
    const auth_id = req.auth.payload.sub;
    const user = await prisma.users.findUnique({
      where: {
        auth_id,
      },
    });
    const isBooked = await prisma.bookings.findFirst({
      where: {
        user_id: user.id,
        cruise_id: +req.body.cruise_id,
      },
    });
    console.log(isBooked);
    if (isBooked) {
      return await res
        .status(409)
        .json({ error: "You already booked for this cruise." });
    }
    const booking = await prisma.bookings.create({
      data: {
        user_id: user.id,
        cruise_id: +req.body.cruise_id,
      },
    });
    res.status(200).json({ data: booking, msg: "Cruise booked successfully." });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});

app.get("/cruise/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const data = await prisma.cruises.findUnique({
      where: {
        id,
      },
    });
    res
      .status(200)
      .json({ data: data, msg: "Cruise detais fetched successfully." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/mybooking", requireAuth, async (req, res) => {
  try {
    const auth_id = req.auth.payload.sub;
    const user = await prisma.users.findUnique({
      where: {
        auth_id,
      },
    });
    const userBookings = await prisma.bookings.findMany({
      where: { user_id: user.id },
      include: { cruise: true },
    });

    res.status(200).json({ data: userBookings, msg: "List of booked Cruise" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});

app.delete("/mybooking/:id", requireAuth, async (req, res) => {
  try {
    const auth_id = req.auth.payload.sub;
    const id = +req.params.id;
    const user = await prisma.users.findUnique({
      where: {
        auth_id,
      },
    });
    console.log(id, user.id);
    await prisma.bookings.deleteMany({
      where: {
        user_id: user.id,
        id: id,
      },
    });
    res.status(200).json({ msg: "Cancelled Booking Successfully!!!" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/contactUs", requireAuth, async (req, res) => {
  try {
    const auth_id = req.auth.payload.sub;
    const { message, subject } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        auth_id,
      },
    });
    console.log(user);
    const data = {
      user_id: user.id,
      message: message,
      subject: subject,
      email: user.email,
    };
    console.log(data);
    const contact = await prisma.contact.create({
      data: data,
    });
    res
      .status(200)
      .json({ data: contact, msg: "Contact Created Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
});
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});

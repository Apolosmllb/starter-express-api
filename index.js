import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { Resend } from "resend";

//Inizialitations
const app = express();

//Settings
app.set("port", process.env.PORT || 5800);

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(json());

//Routes
const resend = new Resend(process.env.RESEND_API_KEY);
app.post("/api/v1/mailing", async (req, res) => {
  try {
    const form = req.body;
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["dynamoservicesweb@gmail.com"],
      subject: "CLIENTE NUEVO! 🤑",
      html: `<p>nombre: <strong>${form?.fullName} </strong>!</p>
            <p>Teléfono: <strong>${form?.phone} </strong>!</p>
            <p>Email: <strong>${form?.email} </strong>!</p>
            <p>asunto: <strong>${form?.subject} </strong>!</p>
            <p>descripción: <strong>${form?.description} </strong>!</p>
            `,
    });
    console.log(data);

    if (data.error) {
      return res
        .status(200)
        .json({ message: "Email was not sent", error: data?.error });
    }

    return res
      .status(200)
      .json({ message: "Email was sent", data: data?.data });
  } catch (error) {
    console.error(error);
  }
});
//Run server
app.listen(app.get("port"), () => {});

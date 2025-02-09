import express, { Request, Response, Express } from "express";
import client from "../db/conn";
import { log } from "console";


export const identify = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;
  if (email || phoneNumber) {
      try {
          console.log("result");
          
          const result = await client.query(
            "SELECT * FROM Contact WHERE email = $1 OR phoneNumber = $2",
            [email, phoneNumber]
          ).catch((err: Error) => {
              console.error("Query error:", err);
              throw err;
          });
      console.log("result");

      if (result.rows.length > 0) {
          const data = result.rows[0];
          console.log(data);
          

        if (data.email != email || data.phonenumber != phoneNumber) {
          const result = await client.query(
            "INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES ($1, $2, $3, $4)",
            [email, phoneNumber, data.id, "secondary"]
          );
          const secondaryContact = result.rows[0];
          const response = {
            contact: {
              primaryContactId: data.id,
              emails: [email],
              phoneNumbers: [phoneNumber],
              secondaryContactIds: [secondaryContact.id],
            },
          };
          res.status(200).json(response);
        } else {
          const response = {
            contact: {
              primaryContactId: data.id,
              emails: [email],
              phoneNumbers: [phoneNumber],
              secondaryContactIds: [],
            },
          };
          res.status(200).json(response);
        }
      } else {
          console.log("asdf");
          
        const result = await client.query(
          "INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES ($1, $2, $3)",
          [email, phoneNumber, "primary"]
        );
        const primaryContact = result.rows[0];
        const response = {
          contact: {
            primaryContactId: primaryContact.id,
            emails: [email],
            phoneNumbers: [phoneNumber],
            secondaryContactIds: [],
          },
        };
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(500).json({
        message: "Error identifying contact",
        error: error,
      });
    }
  } else {
    res.status(400).json({
      message: "Email or phone number is required",
    });
  }
};

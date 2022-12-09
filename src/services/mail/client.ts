import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";

// setup the SES client for N. Virginia
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const client = nodemailer.createTransport({
  SES: { ses, aws },
});

export default client;

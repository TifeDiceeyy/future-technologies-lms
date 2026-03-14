import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-exams";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

function res(statusCode, body) {
  return { statusCode, headers: CORS, body: JSON.stringify(body) };
}

export const handler = async (event) => {
  const method = event.httpMethod;
  const examId = event.pathParameters?.examId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /exams
    if (method === "GET") {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      return res(200, result.Items ?? []);
    }

    // POST /exams
    if (method === "POST") {
      const body = JSON.parse(event.body ?? "{}");
      const item = { ...body, examId: randomUUID() };
      await client.send(new PutCommand({ TableName: TABLE, Item: item }));
      return res(201, item);
    }

    // DELETE /exams/{examId}
    if (method === "DELETE" && examId) {
      await client.send(new DeleteCommand({ TableName: TABLE, Key: { examId } }));
      return res(204, {});
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

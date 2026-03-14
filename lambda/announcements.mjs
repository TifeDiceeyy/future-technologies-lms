import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-announcements";

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
  const announcementId = event.pathParameters?.announcementId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /announcements
    if (method === "GET") {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      const items = (result.Items ?? []).sort(
        (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
      );
      return res(200, items);
    }

    // POST /announcements
    if (method === "POST") {
      const body = JSON.parse(event.body ?? "{}");
      const item = {
        ...body,
        announcementId: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await client.send(new PutCommand({ TableName: TABLE, Item: item }));
      return res(201, item);
    }

    // DELETE /announcements/{announcementId}
    if (method === "DELETE" && announcementId) {
      await client.send(
        new DeleteCommand({ TableName: TABLE, Key: { announcementId } })
      );
      return res(204, {});
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

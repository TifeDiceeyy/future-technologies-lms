import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-assignments";

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
  const assignmentId = event.pathParameters?.assignmentId;
  const studentId = event.queryStringParameters?.studentId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /assignments
    if (method === "GET") {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      let items = result.Items ?? [];
      if (studentId) {
        items = items.filter(
          (i) => String(i.studentId) === String(studentId)
        );
      }
      return res(200, items);
    }

    // POST /assignments
    if (method === "POST") {
      const body = JSON.parse(event.body ?? "{}");
      const item = { ...body, assignmentId: randomUUID() };
      await client.send(new PutCommand({ TableName: TABLE, Item: item }));
      return res(201, item);
    }

    // PUT /assignments/{assignmentId}
    if (method === "PUT" && assignmentId) {
      const body = JSON.parse(event.body ?? "{}");
      const entries = Object.entries(body).filter(([k]) => k !== "assignmentId");
      if (entries.length === 0) return res(400, { message: "No fields to update" });

      const expression = "SET " + entries.map((_, i) => `#k${i} = :v${i}`).join(", ");
      const names = Object.fromEntries(entries.map(([k], i) => [`#k${i}`, k]));
      const values = Object.fromEntries(entries.map(([, v], i) => [`:v${i}`, v]));

      const result = await client.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { assignmentId },
          UpdateExpression: expression,
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
          ReturnValues: "ALL_NEW",
        })
      );
      return res(200, result.Attributes);
    }

    // DELETE /assignments/{assignmentId}
    if (method === "DELETE" && assignmentId) {
      await client.send(
        new DeleteCommand({ TableName: TABLE, Key: { assignmentId } })
      );
      return res(204, {});
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-courses";

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
  const courseId = event.pathParameters?.courseId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /courses
    if (method === "GET" && !courseId) {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      return res(200, result.Items ?? []);
    }

    // GET /courses/{courseId}
    if (method === "GET" && courseId) {
      const result = await client.send(
        new GetCommand({ TableName: TABLE, Key: { courseId } })
      );
      if (!result.Item) return res(404, { message: "Course not found" });
      return res(200, result.Item);
    }

    // POST /courses
    if (method === "POST") {
      const body = JSON.parse(event.body ?? "{}");
      // courseId must be a STRING — the DynamoDB table partition key is type S.
      // Accept client-provided id but always stringify it to avoid type mismatch.
      const courseId = String(body.courseId ?? Date.now());
      const item = { ...body, courseId };
      await client.send(new PutCommand({ TableName: TABLE, Item: item }));
      return res(201, item);
    }

    // PUT /courses/{courseId}
    if (method === "PUT" && courseId) {
      const body = JSON.parse(event.body ?? "{}");
      const entries = Object.entries(body).filter(([k]) => k !== "courseId");
      if (entries.length === 0) return res(400, { message: "No fields to update" });

      const expression = "SET " + entries.map((_, i) => `#k${i} = :v${i}`).join(", ");
      const names = Object.fromEntries(entries.map(([k], i) => [`#k${i}`, k]));
      const values = Object.fromEntries(entries.map(([, v], i) => [`:v${i}`, v]));

      const result = await client.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { courseId },
          UpdateExpression: expression,
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
          ReturnValues: "ALL_NEW",
        })
      );
      return res(200, result.Attributes);
    }

    // DELETE /courses/{courseId}
    if (method === "DELETE" && courseId) {
      await client.send(new DeleteCommand({ TableName: TABLE, Key: { courseId } }));
      return res(204, {});
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

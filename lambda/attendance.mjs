import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-attendance";

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
  const studentId = event.queryStringParameters?.studentId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /attendance — optionally filtered by studentId
    if (method === "GET") {
      if (studentId) {
        const result = await client.send(
          new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: "studentId = :sid",
            ExpressionAttributeValues: { ":sid": studentId },
          })
        );
        return res(200, result.Items ?? []);
      }
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      return res(200, result.Items ?? []);
    }

    // POST /attendance
    if (method === "POST") {
      const body = JSON.parse(event.body ?? "{}");
      if (!body.studentId || !body.courseId) {
        return res(400, { message: "studentId and courseId are required" });
      }
      await client.send(new PutCommand({ TableName: TABLE, Item: body }));
      return res(201, body);
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

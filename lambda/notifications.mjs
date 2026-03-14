import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-notifications";

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
  const path = event.path ?? "";
  const studentId =
    event.queryStringParameters?.studentId ??
    JSON.parse(event.body ?? "{}").studentId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /notifications?studentId=xxx
    if (method === "GET") {
      if (!studentId) return res(400, { message: "studentId is required" });
      const result = await client.send(
        new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: "studentId = :sid",
          ExpressionAttributeValues: { ":sid": String(studentId) },
        })
      );
      return res(200, result.Items ?? []);
    }

    // PUT /notifications/read — mark all as read for a studentId
    if (method === "PUT" && path.endsWith("/read")) {
      if (!studentId) return res(400, { message: "studentId is required" });

      // Query all notifications for student first
      const result = await client.send(
        new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: "studentId = :sid",
          ExpressionAttributeValues: { ":sid": String(studentId) },
        })
      );

      const items = result.Items ?? [];
      await Promise.all(
        items.map((item) =>
          client.send(
            new UpdateCommand({
              TableName: TABLE,
              Key: { studentId: item.studentId, notificationId: item.notificationId },
              UpdateExpression: "SET #r = :t",
              ExpressionAttributeNames: { "#r": "read" },
              ExpressionAttributeValues: { ":t": true },
            })
          )
        )
      );

      return res(200, { updated: items.length });
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = "mindcampus-students";

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
  const studentId = event.pathParameters?.studentId;

  if (method === "OPTIONS") return res(200, {});

  try {
    // GET /students
    if (method === "GET") {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      return res(200, result.Items ?? []);
    }

    // PUT /students/{studentId} — update status only
    if (method === "PUT" && studentId) {
      const body = JSON.parse(event.body ?? "{}");
      const { status } = body;
      if (!status || !["active", "inactive"].includes(status)) {
        return res(400, { message: "status must be 'active' or 'inactive'" });
      }

      const result = await client.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { studentId },
          UpdateExpression: "SET #s = :s",
          ExpressionAttributeNames: { "#s": "status" },
          ExpressionAttributeValues: { ":s": status },
          ReturnValues: "ALL_NEW",
        })
      );
      return res(200, result.Attributes);
    }

    return res(405, { message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res(500, { message: err.message });
  }
};

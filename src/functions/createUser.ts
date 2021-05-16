import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";

export const handle = async (event) => {

    const { email } = event.body;

    const userAlreadyExists = await document.query({
        TableName: "users",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    }).promise();

    if(userAlreadyExists.Items[0]) throw Error("User Already Exists");

    await document.put({
        TableName: "users",
        Item: {
            id: uuidV4(),
            email,
            todos: []
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "User created!",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }
}
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  generateRecipe: a
    .query()
    .arguments({
      ingredients: a.string().array(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: "bedrockDS",
        entry: "./bedrock.js",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
import { StackContext, Api, EventBus } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": "packages/functions/lambda.handler",
      "GET /todo": "packages/functions/todo.list",
      "POST /todo": "packages/functions/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}

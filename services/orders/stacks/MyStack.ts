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
      "GET /": "src/functions/lambda.handler",
      "GET /todo": "src/functions/todo.list",
      "POST /todo": "src/functions/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "src/functions/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}

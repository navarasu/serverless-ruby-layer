require "uuidtools"

def hello(event:, context:)
  { statusCode: 200, body: {
    "random_uuid": UUIDTools::UUID.random_create.to_s
    }
  }
end

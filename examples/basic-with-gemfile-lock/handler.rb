require 'httparty'

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body

  { statusCode: 200, body: body }
end

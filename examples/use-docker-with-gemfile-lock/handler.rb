require 'http'
require 'nokogiri'

def hello(event:, context:)
  { statusCode: 200, body: 'hello' }
end

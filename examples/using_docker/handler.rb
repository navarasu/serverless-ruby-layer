require 'http'
require 'nokogiri'

def hello(event:, context:)
  body = HTTP.get('https://github.com').body.to_s
  doc = Nokogiri::HTML(body)

  { statusCode: 200, body: doc.title }
end

require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

def hello(event:, context:)
  body = HTTParty.get("https://github.com").body
  doc = Nokogiri::HTML(body)

  { statusCode: 200, body: doc.title }
end

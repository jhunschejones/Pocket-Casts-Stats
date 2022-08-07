require "httparty"
require "json"
require "tzinfo"

class PocketCasts
  LOGIN_URL = "https://api.pocketcasts.com/user/login"
  STATS_URL = "https://api.pocketcasts.com/user/stats/summary"

  def total_seconds_listened
    @total_seconds_listened ||= begin
      body = {}
      headers = {
        "Origin" => "https://play.pocketcasts.com",
        "Authorization" => "Bearer #{token}",
        "Accept": "*/*",
      }
      response = HTTParty.post(STATS_URL, body: body, headers: headers)
      raise "Unexpected #{response.code} response" if !response.success?
      JSON.parse(response.body)["timeListened"].to_i
    end
  end

  private

  def token
    @token ||= begin
      return ENV["POCKET_CASTS_TOKEN"] if ENV["POCKET_CASTS_TOKEN"]
      raise "Missing credentials" unless ENV["POCKET_CASTS_EMAIL"] && ENV["POCKET_CASTS_PASSWORD"]

      body = {
        email: ENV["POCKET_CASTS_EMAIL"],
        password: ENV["POCKET_CASTS_PASSWORD"],
        scope: "webplayer"
      }
      headers = { "Origin" => "https://play.pocketcasts.com" }
      response = HTTParty.post(LOGIN_URL, body: body, headers: headers)
      raise "Unexpected #{response.code} response" if !response.success?

      JSON.parse(response.body)["token"]
    end
  end
end

if __FILE__ == $0
  todays_file = "./stats/#{TZInfo::Timezone.get("America/Chicago").now.strftime("%Y-%m-%d")}"
  todays_total = PocketCasts.new.total_seconds_listened
  File.open(todays_file, "w") { |file| file.write(todays_total) }
end

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
      json_response = JSON.parse(response.body)
      json_response["timeListened"].to_i
    end
  end

  private

  def token
    @token ||= begin
      raise "No password provided" unless ENV["POCKET_CASTS_PASSWORD"]
      body = {
        email: "joshjones103@gmail.com",
        password: ENV["POCKET_CASTS_PASSWORD"],
        scope: "webplayer"
      }
      headers = { "Origin" => "https://play.pocketcasts.com" }
      response = HTTParty.post(LOGIN_URL, body: body, headers: headers)
      json_response = JSON.parse(response.body)
      json_response["token"]
    end
  end
end

todays_file = "./stats/#{TZInfo::Timezone.get("America/Chicago").now.strftime("%Y-%m-%d")}"

File.open(todays_file, "w") do |file|
  file.write(PocketCasts.new.total_seconds_listened)
end

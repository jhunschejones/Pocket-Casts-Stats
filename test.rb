require "minitest/autorun"
require "minitest/spec"
require "mocha/minitest"
require_relative "main"

describe PocketCasts do
  before do
    @pocket_casts = PocketCasts.new
    @success_response = mock()
    @success_response.stubs(:success?).returns(true)
    @error_response = mock()
    @error_response.stubs(:success?).returns(false)
    @error_response.stubs(:code).returns(401)
  end

  describe "#total_seconds_listened" do
    it "returns total time listened" do
      time_listened = 100
      @success_response.stubs(:body).returns({ "timeListened" => time_listened }.to_json)
      HTTParty.stubs(:post).returns(@success_response)

      assert_equal time_listened, @pocket_casts.total_seconds_listened
    end

    it "raises on error response" do
      HTTParty.stubs(:post).returns(@error_response)
      error = assert_raises(StandardError) do
        @pocket_casts.total_seconds_listened
      end

      assert_equal "Unexpected 401 response", error.message
    end
  end
end

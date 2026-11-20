# frozen_string_literal: true

require 'test_helper'

class QrcodePngDataUriTest < ActiveSupport::TestCase
  test 'returns a base64-encoded PNG data uri' do
    data_uri = QrcodePngDataUri.call('https://example.com/confirmed?group_id=1&secret=xxx')

    assert_match(%r{\Adata:image/png;base64,}, data_uri)

    encoded = data_uri.sub('data:image/png;base64,', '')
    decoded = Base64.strict_decode64(encoded)
    assert_equal "\x89PNG".b, decoded.byteslice(0, 4)
  end
end

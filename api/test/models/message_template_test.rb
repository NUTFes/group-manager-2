# frozen_string_literal: true

require 'test_helper'

class MessageTemplateTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    MessageTemplate.delete_all
  end

  test 'renders supported variables and keeps unsupported variables' do
    template = MessageTemplate.new(
      valid_attributes.merge(
        subject: 'Subject {group_name} {unknown}',
        body: '{group_name} {user_name} {resubmit_memo} {unknown}'
      )
    )

    values = {
      'group_name' => '企画団体',
      'user_name' => '代表者',
      'resubmit_memo' => '修正してください'
    }

    assert_equal 'Subject 企画団体 {unknown}', template.render_subject(values)
    assert_equal '企画団体 代表者 修正してください {unknown}', template.render_body(values)
  end

  test 'renders supported variables with symbol keys' do
    template = MessageTemplate.new(
      valid_attributes.merge(
        subject: 'Subject {group_name}',
        body: '{group_name} {user_name} {resubmit_memo}'
      )
    )

    values = {
      group_name: '企画団体',
      user_name: '代表者',
      resubmit_memo: '修正してください'
    }

    assert_equal 'Subject 企画団体', template.render_subject(values)
    assert_equal '企画団体 代表者 修正してください', template.render_body(values)
  end

  test 'normalizes body newlines before save' do
    template = MessageTemplate.create!(valid_attributes.merge(body: "1行目\r\n2行目\r3行目"))

    assert_equal "1行目\n2行目\n3行目", template.body
  end

  test 'requires locale name subject and body' do
    template = MessageTemplate.new

    assert_not template.valid?
    assert template.errors.added?(:locale, :blank)
    assert template.errors.added?(:name, :blank)
    assert template.errors.added?(:subject, :blank)
    assert template.errors.added?(:body, :blank)
  end

  test 'does not allow duplicate name in same locale' do
    MessageTemplate.create!(valid_attributes)
    duplicate_template = MessageTemplate.new(valid_attributes)

    assert_not duplicate_template.valid?
    assert duplicate_template.errors.added?(:name, :taken, value: 'GM再提出依頼')
  end

  test 'allows same name in different locale' do
    MessageTemplate.create!(valid_attributes)
    template = MessageTemplate.new(valid_attributes.merge(locale: 'en'))

    assert template.valid?
  end

  test 'manages locale as enum' do
    template = MessageTemplate.create!(valid_attributes)

    assert template.ja?
    assert_equal 'ja', template.locale
    assert_equal %w[ja en], MessageTemplate::SUPPORTED_LOCALES
  end

  test 'does not allow unsupported locale' do
    error = assert_raises(ArgumentError) do
      MessageTemplate.new(valid_attributes.merge(locale: 'fr'))
    end

    assert_match(/is not a valid locale/, error.message)
  end

  test 'seeds create default templates idempotently' do
    assert_difference('MessageTemplate.count', 2) do
      load Rails.root.join('db/seeds.rb')
    end

    assert_no_difference('MessageTemplate.count') do
      load Rails.root.join('db/seeds.rb')
    end

    assert MessageTemplate.exists?(name: 'GM再提出依頼', locale: :ja)
    assert MessageTemplate.exists?(name: 'GM Resubmission Request', locale: :en)
  end

  private

  def valid_attributes
    {
      locale: 'ja',
      name: 'GM再提出依頼',
      subject: '件名',
      body: '本文'
    }
  end
end

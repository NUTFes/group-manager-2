# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

MessageTemplate.find_or_create_by!(name: 'GM再提出依頼', locale: :ja) do |template|
  template.subject = '【GM再提出】：申請内容に不備があったため、修正し再提出をお願いします。'
  template.body = <<~BODY
    {group_name} 代表 {user_name} 様

    お世話になっております。
    技大祭実行委員会です。

    GMにてご申請いただきありがとうございます。
    申請内容について確認したいことがありますのでご連絡しております。
    以下をご確認のうえ、GMにて再提出をお願いいたします。

    {resubmit_memo}

    その他、ご不明点がございましたらお気軽にご質問ください。

    ご確認よろしくお願いいたします。

    ○●ーーーーーーーーーーーーーーーーー●○
    長岡技術科学大学
    45th技大祭実行委員会
    E-mail: nutfes.soumu@gmail.com
    ○●ーーーーーーーーーーーーーーーーー●○
  BODY
end

MessageTemplate.find_or_create_by!(name: 'GM Resubmission Request', locale: :en) do |template|
  template.subject = '[GM Resubmission Request] Please revise and resubmit your application.'
  template.body = <<~BODY
    Dear {user_name},

    Thank you for submitting your application through GM.
    We are contacting you because there are items we would like you to confirm.
    Please check the following and resubmit your application through GM.

    Group: {group_name}

    {resubmit_memo}

    If you have any questions, please feel free to contact us.

    Sincerely,

    Nagaoka University of Technology
    45th NUT Festival Executive Committee
    E-mail: nutfes.soumu@gmail.com
  BODY
end

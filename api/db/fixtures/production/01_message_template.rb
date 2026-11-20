# frozen_string_literal: true

MessageTemplate.seed(:name, :locale,
                     {
                       name: 'GM再提出依頼',
                       locale: :ja,
                       subject: '【GM再提出】：申請内容に不備があったため、修正し再提出をお願いします。',
                       body: <<~BODY
                         {group_name} 代表 {user_name} 様

                         お世話になっております。
                         技大祭実行委員会です。

                         GMにてご申請いただきありがとうございます。
                         申請内容について確認したいことがありますのでご連絡しております。
                         以下をご確認のうえ、GMにて再提出をお願いいたします。

                         その他、ご不明点がございましたらお気軽にご質問ください。

                         ご確認よろしくお願いいたします。

                         ○●ーーーーーーーーーーーーーーーーー●○
                         長岡技術科学大学
                         45th技大祭実行委員会
                         E-mail: nutfes.soumu@gmail.com
                         ○●ーーーーーーーーーーーーーーーーー●○
                       BODY
                     },
                     {
                       name: 'GM Resubmission Request',
                       locale: :en,
                       subject: '[GM Resubmission Request] Please revise and resubmit your application.',
                       body: <<~BODY
                         Dear {user_name},

                         Thank you for submitting your application through GM.
                         We are contacting you because there are items we would like you to confirm.
                         Please check the following and resubmit your application through GM.

                         Group: {group_name}

                         If you have any questions, please feel free to contact us.

                         Sincerely,

                         Nagaoka University of Technology
                         45th NUT Festival Executive Committee
                         E-mail: nutfes.soumu@gmail.com
                       BODY
                     })

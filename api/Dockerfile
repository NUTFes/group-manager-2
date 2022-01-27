FROM ruby:2.7.1


#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
#      && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
#      && apt-get update \
#      && apt-get install -y nodejs npm yarn \
#      && apt-get install -y build-essential libpq-dev libgtk-3.0 libnss3 libatk-bridge2.0-0\
#      && mkdir /myapp
 
# M1 Mac 対策 
RUN wget --quiet -O - /tmp/pubkey.gpg https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo 'deb http://dl.yarnpkg.com/debian/ stable main' > /etc/apt/sources.list.d/yarn.list
      && apt-get update \
      && apt-get install -y nodejs npm yarn \
      && apt-get install -y build-essential libpq-dev libgtk-3.0 libnss3 libatk-bridge2.0-0\
      && mkdir /myapp

RUN apt-get install fonts-ipa*


WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY . /myapp

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]


FROM ruby:2.7.1
WORKDIR /myapp
ENV RAILS_ENV="production"
ENV RAILS_LOG_TO_STDOUT=ON
COPY ./api /myapp
RUN bundle install
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
EXPOSE 3000
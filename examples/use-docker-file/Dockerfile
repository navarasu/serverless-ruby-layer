FROM lambci/lambda:build-ruby2.7

RUN yum install -y postgresql-devel
RUN gem update bundler

RUN bundle config set --local path build
RUN bundle config set --local without test development

COPY Gemfile* .

RUN bundle install

CMD "/bin/bash"

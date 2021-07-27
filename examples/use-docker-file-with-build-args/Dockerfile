FROM lambci/lambda:build-ruby2.5 AS base

ARG SERVERLESS_RUBY_LAYER_TEST_ARG
ENV SERVERLESS_RUBY_LAYER_TEST_ENV_VAR=${SERVERLESS_RUBY_LAYER_TEST_ARG}

RUN gem update bundler

RUN echo "a dummy file that we generate every time" > ./test_arg_dummy

RUN if [[ -z "$SERVERLESS_RUBY_LAYER_TEST_ARG" ]] ; then echo "Argument not provided" ; else echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG"; echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG" > ./test_arg_present ; fi

CMD "/bin/bash"

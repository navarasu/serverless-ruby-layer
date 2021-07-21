FROM lambci/lambda:build-ruby2.5 AS base

ARG SERVERLESS_RUBY_LAYER_TEST_ARG
ENV SERVERLESS_RUBY_LAYER_TEST_ENV_VAR=${SERVERLESS_RUBY_LAYER_TEST_ARG}

RUN gem update bundler

RUN pwd

RUN echo $SERVERLESS_RUBY_LAYER_TEST_ENV_VAR

RUN echo "a dummy file to provide at least one match to /test_arg*" > ./test_arg_dummy

RUN if [[ -z "$SERVERLESS_RUBY_LAYER_TEST_ARG" ]] ; then echo Argument not provided ; else echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG"; echo "Argument is $SERVERLESS_RUBY_LAYER_TEST_ARG" > ./test_arg_present ; fi

RUN echo "SERVERLESS_RUBY_LAYER_TEST_ENV_VAR is equal to ${SERVERLESS_RUBY_LAYER_TEST_ENV_VAR}"

RUN ls -al /var/task

CMD "/bin/bash"

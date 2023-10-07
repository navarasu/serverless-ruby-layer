FROM public.ecr.aws/sam/build-ruby3.2:latest-x86_64

RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras enable postgresql10
RUN yum install -y postgresql-devel
RUN gem update bundler

CMD "/bin/bash"

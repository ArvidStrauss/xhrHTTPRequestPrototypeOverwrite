FROM fedora:29

# handle the proxy mess
ENV http_proxy=http://proxy.mms-at-work.de:8080 https_proxy=http://proxy.mms-at-work.de:8080
RUN echo "proxy=http://proxy.mms-at-work.de:8080" >> /etc/dnf/dnf.conf

# install required packages
RUN yum -y -v install nodejs 
RUN yum -y -v install gradle 
RUN yum -y -v install bzip2 
RUN yum -y -v install gcc-c++
RUN yum -y -v install git
RUN yum -y -v install docker
RUN yum -y -v install openssh
RUN yum -y -v install java-11-openjdk-devel

# more proxy stuff...
RUN npm config set https-proxy http://proxy.mms-at-work.de:8080
RUN npm config set proxy http://proxy.mms-at-work.de:8080

# add docker related stuff
RUN groupadd docker

# prepare ssh
RUN useradd -u 1000 jkbuild 
RUN gpasswd -a jkbuild docker
ENV HOME=/home/jkbuild
COPY Build/ssh /home/jkbuild/.ssh
RUN chmod 600 /home/jkbuild/.ssh/id_rsa
RUN chown -Rfv 1000:1000 /home/jkbuild

# provide the yarn command globally
RUN npm install -g yarn@1.10.1

# set java to version 11
RUN alternatives --set java java-11-openjdk.x86_64

RUN java --version
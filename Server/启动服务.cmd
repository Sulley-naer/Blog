@echo off

# 配置你的Java路径
set JAVA_HOME=C:\Java\
set PATH=%JAVA_HOME%\bin;%PATH%

java --version

java -jar target/Blog-0.0.1-SNAPSHOT.jar
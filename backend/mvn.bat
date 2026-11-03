@echo off
if "%JAVA_HOME%"=="" set JAVA_HOME=C:\Program Files\Java\jdk-26.0.1
call "%~dp0mvnw.cmd" %*

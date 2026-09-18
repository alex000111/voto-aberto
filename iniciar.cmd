@echo off
cd /d "%~dp0"
call npm.cmd run dev -- --hostname 127.0.0.1
pause

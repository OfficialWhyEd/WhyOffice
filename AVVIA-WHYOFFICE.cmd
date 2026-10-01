@echo off
rem WhyOffice: apre l ufficio su questo PC. Password in E:\Chiavi\whyoffice.txt
cd /d E:\Dev\WhyOffice
for /f "tokens=2" %%a in ('findstr /b "password:" E:\Chiavi\whyoffice.txt') do set WOPASS=%%a
start "" http://localhost:4600
node bin\agent-office.js --port 4600 --password %WOPASS% --no-open

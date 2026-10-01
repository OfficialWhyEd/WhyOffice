@echo off
rem WhyOffice: apre l ufficio per questo PC, iPad e iPhone (stessa rete di casa, con password). Password in E:\Chiavi\whyoffice.txt
cd /d E:\Dev\WhyOffice
for /f "tokens=2" %%a in ('findstr /b "password:" E:\Chiavi\whyoffice.txt') do set WOPASS=%%a
rem il browser lo apre WhyOcto (tasto WhyOffice) o http://localhost:4600
node bin\agent-office.js --host 0.0.0.0 --port 4600 --password %WOPASS% --no-open

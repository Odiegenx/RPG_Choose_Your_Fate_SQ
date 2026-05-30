This readme assumes you are in the k6 folder.

Run this command to set k6 to create html report for the test you want to run
For example this will create a stress test report
```
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=results/stress-test-report.html k6 run tests/stress-test.js 
```

Remember to set the environment variables for the k6 user and password.

Replace test with an actual user in the database

Linux:
```
export K6_USERNAME=admin
export K6_PASSWORD=admin123
```

Windows:
```
set K6_USERNAME=admin
set K6_PASSWORD=admin123
```

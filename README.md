# Setup:
1. Run "npm install" in root directory
2. Run "gulp" in root directory to build files and create delivery artifact
3. If you add more source files, you have to integrate them into the building process defined in "gulpfile.js"

# Additional Information
Basically the project consists of 9 main files:
* "custom_code.js" - includes custom nav menu and several layout adjustemnts, add future not tracking related adjustments here
* "tracking_utils.js" - contains tracking supporting functions
* "tracking_db.js" - tracking item naming database which stores information about all trackable objects
* "tracking.js" - includes tracking logic, add future tracking related adjustments here
* "db_custom_style.css" - includes all custom css adjustments for DB Planet
* "schenker_custom_style.css" - includes all custom css adjustments for the Schenker Design
* "custom_code_dev.html" - HTML template for final DEV source file, including Matomo configuration
* "custom_code_test.html" - HTML template for final TEST source file, including Matomo configuration
* "custom_code_prod.html" - HTML template for final PROD source file, including Matomo configuration
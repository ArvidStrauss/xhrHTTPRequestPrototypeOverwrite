# Coyo Tracking Script Generator

## Project Structure

### common

Contains the shared files for all projects. The main tracking for coyo in general is handled here. Also the whole gulp task and build setup happens here.
Files are listed in loadorder:

- "tracking_db.js" = tracking item naming database which stores information about all trackable objects
- "tracking_utils.js" = contains tracking supporting functions
- "tracking.js" = the main tracking logic, add an http-interceptor to catch responses and send tracking events based on provided data
- "click_tracking.js" = additional pure onclick tracking logic like navigation actions or videoviews (onplay)
- "gulpfile.js" = included by each customer project, does all the magic (building)

### BasicExampleProject

This is an example Project with the basic setup. So all files and variables for customizing exist but are basically empty.
This project tracks everything we can for now, but with pure coyo-data. No renaming or other customer specific stuff.

#### build

- created after first build
- contains the build output, normal and minified

#### delivery

- contains the zipped packages with versionnumbers set in gulpfile

##### local

- created after first gulp local task
- contains the built localtracking.js which is delivered by http-server

#### src

- "localtracking.js" = the DEV setup for use with local development, see [development](#development)
- "tracking_config_dev.html" = HTML template for final DEV source file, including Matomo and all other kinds of configuration
- "tracking_config_test.html" = HTML template for final TEST source file, including Matomo and all other kinds of configuration
- "tracking_config_prod.html" = HTML template for final PROD source file, including Matomo and all other kinds of configuration
- "gulpfile.js" = the project specific setup, make sure to setup projectData correctly

## Setup

1. Run "npm install" in root directory

## Development

1. Switch to the customer project directory
2. Run "gulp local" to create a file "local/localtracking.js" which uses the src/localtracking.js inside the mainfolder for settings and the normal buildprocess.  
This also sets a watcher on the file, so it gets rebuilt if you change anything in your code.
3. Run "npm run serve" to start a local http-server, making the "local" folder accessible on web
4. Login to Coyo as admin and go to administration->general settings
5. In the textfield "Tracking Code" enter a script tag with the path to your local file, e.g. ```<script type="text/javascript" src="http://127.0.0.1:8080/localtracking.js" />```
6. Go back to the normal Coyo Pages, check if localtracking.js is loaded, matomo gets initialized and things are being tracked
7. Have fun developing and see you changes on the fly!

## Create a new Customer Project

1. Copy the "BasicExampleProject" and rename it
2. Edit ProjectData in the folders "gulpfile.js" to match you customer
3. Setup Variables in "tracking_config_\[dev|tast/prod\].html", see comments inside these files for further details
4. Generate you first delivery, feel free to [add more custom code](#customizing)

## Generate Deliveries

1. Go into the customer project directory
2. Run "gulp" in the customers project directory to build files and create delivery artifact
3. Edit the projectVersion and projectDate in "project/gulpfile.js" after each delivery!

## Customizing

### Important Rules

1. Think before adding customizing! Is the change something customer specific (add to project folder) or nice to have for all (add to common)?
2. If you add mandatory functionality to common, make sure you do not break other projects! (e.g. add new stuff requiring a config inside each project...)

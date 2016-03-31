# Handymap
Geo service for visualize historical events and processes

##Setting up project for development

###Requrements
* Node JS 4.x
* Python 3.4
* Flask
* SQLAlhemy
* Flask-Failsafe
* Flask-Migrate
* Flask-Script
* Flask-SQLAlchemy
* Flask-User
* Flask-Via
* Coverage python module
* PostgreSQL

###Setting up
####Installing dependencies on Fedora linux
#####Install node 4 repository:
```
sudo dnf install https://rpm.nodesource.com/pub_4.x/fc/23/x86_64/nodesource-release-fc23-1.noarch.rpm
```
#####Nodejs, Python and system dependencies for it:
```
sudo dnf check-update
sudo dnf install nodejs gcc gcc-c++ make glibc-headers python3 python3-virtualenv python3-devel python3-psycopg2 postgresql postgresql-devel postgresql-server postgresql-contrib libffi-devel redhat-rpm-config
```
#####Setting up python environment:
Create virtual python environment:
```
cd path/to/your/project/folder
virtualenv-3.4 hm_env
```
where hm_env — name for your virtual environment for this project.

Switch to this environment:
```
source hm_env/bin/activate
```

Install project Python dependencies:
```
pip install -r requirements.txt
```
#####Install project NodeJS dependencies:
```
sudo npm install -g gulp-cli
npm install
```
Take a break while npm working on =)

#####Start PostgreSQL database server:
```
sudo postgresql-setup --initdb
sudo systemctl start postgresql
```
Now we need to create database for development.
First, we need to create user in database, wich will be used by our app for access to db.
Switch to postgres user and open postresql console for initial setup:
```
sudo -iu postgres
psql
```
In postgres console:
```
CREATE USER hm WITH password 'hm';
CREATE DATABASE hm;
GRANT ALL privileges ON DATABASE hm TO hm;
```
*Note, if you want to use other user instead of "hm", you need to change "hm" on your username and password in Handymap configuration file `settings.py`*

After that, exit psql console by pressing Ctrl+D and log out from user postgresql (Ctrl+D).
Next, open file /var/lib/pgsql/data/pg_hba.conf under root user, for example:
```
sudo nano /var/lib/pgsql/data/pg_hba.conf
```
In the end of file you can see smtg like:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
```
change `local all all peer` to `local all all md5` to enable password authentication for users created only for postgresql.
It could be smtg like:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5
```
After that, save file and restart PostgreSQL server:
```
sudo systemctl restart postgresql
```
Enable autostart PostgreSQL database server on system boot:
```
sudo systemctl enable postgresql
```
Done! =)

##Development server
Use `gulp` for start dev server and serving frontend files:
```
gulp
```
To only build frontend files and not watch for changes:
```
gulp buildDev 
```
To start all tests use:
```
gulp test
```
To start only backend tests:
```
gulp testServer
```
To start only frontend tests:
```
gulp testClient
```
Create database inital data:
```
./manage.py create_db
```
Create initial admin user:
```
./manage.py create_admin
```
Delete all information in database:
```
./manage.py drop_db
```
If you want start only Python development server without serving frontent files use `manage.py`:
```
./manage.py runserver
```
To use Python shell in Handymap context:
```
./manage.py shell
```

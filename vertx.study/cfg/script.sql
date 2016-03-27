create table if not exists verticle (
name varchar(50) primary key
, verticle varchar(200)
, worker boolean
, instances int
, auto_start boolean
, status varchar(100)
, deploy_id varchar(200)
, trigger boolean
);
update verticle set status = '', deploy_id = '', trigger = false;
create table if not exists db (
name varchar(50) primary key
, driver_class varchar(100)
, url varchar(400)
, user varchar(100)
, password varchar(100)
, auto_start boolean
, memo varchar
, status varchar(100)
);
update db set status = '';
create table if not exists sql (
name varchar(50) primary key
, db  varchar(50)
, sql varchar
);


create table config_api (
 name varchar(30)  primary key
, address varchar(100)
, db varchar(30)
, sql varchar
, memo varchar
);

insert into config_api values('getDbInfo', 'db.select', 'admin', 'select * from config_db', '')

--insert into verticle (name, verticle, worker, instances, auto_Start) values('adminServer', 'nrms.rms.AdminServer', false, 1, true);
--insert into db (name,driver_class,url,user,password, auto_start) values('h2', 'org.h2.Driver', 'jdbc:h2:./h2db/data','','',true );

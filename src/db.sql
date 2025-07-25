create table users (
	id serial primary key,
	email text not null unique,
	first_name text not null,
	last_name text not null,
	password text not null,
	profile_image text
)

create table users_wallet (
	id serial primary key,
	balance decimal not null default(0),
	owner_id integer not null,
	constraint fk_wallet_owner foreign key (owner_id) references users (id) on delete cascade
)

create table banners (
	id serial primary key,
	banner_name text not null,
	banner_image text not null,
	description text not null
)

create table services (
	id serial primary key,
	service_code text not null unique,
	service_name text not null,
	service_icon text not null,
	service_tarif decimal not null
)

create table transaction_history (
	id serial primary key,
	invoice_number text not null unique,
	transaction_type text not null,
	description text not null,
	total_amount decimal not null,
	created_on timestamp not null default (now()),
	wallet_id integer not null,
	constraint fk_wallet_transaction foreign key (wallet_id) references users_wallet(id) on delete cascade
)
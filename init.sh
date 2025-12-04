#! /bin/bash

# Check for dependencies
if ! command -v node >/dev/null 2>&1; then
	echo "Missing node."
	exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
	echo "Missing npm."
	exit 1
fi
if ! command -v sqlite3 >/dev/null 2>&1; then
	echo "Missing sqlite3."
	exit 1
fi
if ! command -v sqlcipher >/dev/null 2>&1; then
	echo "Missing sqlcipher."
	exit 1
fi
if ! command -v openssl >/dev/null 2>&1; then
	echo "Missing openssl."
	exit 1
fi

# Install npm packages
npm install

# Init the db
./db/scripts/create
./db/scripts/encrypt

# Inits .env
printf "Enter password for the DB once again: \n"
read -r PASSWORD

{
	echo APP_HOST=\"http://localhost\"
	echo APP_PORT=3334
	printf "\n"
	echo '# DATABASE'
	echo DB_PATH=\"/db/chitchat.db\"
	echo DB_PASS=\""$PASSWORD"\"
} >.env

echo "You can still manually edit the rest of the .env file to your liking."

# Starts project
npm run dev

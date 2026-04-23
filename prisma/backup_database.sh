#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"
BACKUP_DIR="$SCRIPT_DIR/backups"

# Load environment variables from .env file
load_env_file() {
  if [ -f "$ENV_FILE" ]; then
    set -a; source $ENV_FILE; set +a
  else
    echo "Error: .env file not found at $ENV_FILE"
    exit 1
  fi
}

show_help() {
  echo "Usage: backup_database.sh [-e <env_file>] [-d <database_name>] [-u <username>] [-w <password>] [-h <host>] [-p <port>] [-o <output_file>]"
  echo "  -e <env_file>        Path to the .env file (default: ../.env relative to the script)"
  echo "  -d <database_name>   Name of the database to dump (default: value from .env)"
  echo "  -u <username>        Username for the PostgreSQL database (default: value from .env)"
  echo "  -w <password>        Password for the PostgreSQL user (default: value from .env)"
  echo "  -h <host>            Host address of the PostgreSQL server (default: value from .env)"
  echo "  -p <port>            Port number for the PostgreSQL server (default: 5432)"
  echo "  -o <output_file>     Output file name for the database dump"
  echo "  -help                Display this help message"
}

while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -e|--env)
      ENV_FILE="$2"
      shift # past argument
      shift # past value
      ;;
    -d|--database)
      DB_NAME="$2"
      shift # past argument
      shift # past value
      ;;
    -u|--user)
      DB_USER="$2"
      shift # past argument
      shift # past value
      ;;
    -w|--password)
      DB_PASSWORD="$2"
      shift # past argument
      shift # past value
      ;;
    -h|--host)
      DB_HOST="$2"
      shift # past argument
      shift # past value
      ;;
    -p|--port)
      DB_PORT="$2"
      shift # past argument
      shift # past value
      ;;
    -o|--output)
      OUTPUT_FILE="$2"
      shift # past argument
      shift # past value
      ;;
    -help|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      show_help
      exit 1
      ;;
  esac
done

load_env_file

DB_NAME="${DB_NAME:-$POSTGRES_DATABASE}"
DB_USER="${DB_USER:-$POSTGRES_USER}"
DB_PASSWORD="${DB_PASSWORD:-$POSTGRES_PASSWORD}"
DB_HOST="${DB_HOST:-$POSTGRES_HOST}"
DB_PORT="${DB_PORT:-5432}" # Default port to 5432 if not set

# Validate required variables
if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_HOST" ]; then
  echo "Error: Database name, user, password, and host must be provided."
  show_help
  exit 1
fi

mkdir -p "$BACKUP_DIR"

if [ -z "$OUTPUT_FILE" ]; then
  OUTPUT_FILE="${DB_NAME}_backup_$(date +%Y%m%d%H%M%S).dump"
fi

OUTPUT_FILE_PATH="$BACKUP_DIR/$OUTPUT_FILE"
export PGPASSWORD="$DB_PASSWORD"

pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -F c -f "$OUTPUT_FILE_PATH"

# Check if the pg_dump command was successful
if [ $? -eq 0 ]; then
  echo "Database dump created successfully: $OUTPUT_FILE_PATH"
else
  echo "Error: Database dump failed."
  exit 1
fi

unset PGPASSWORD

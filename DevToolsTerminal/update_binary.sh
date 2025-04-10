#!/bin/bash

API_KEY=$CJF_API_KEY

# Check if API key is provided as argument
if [ "$1" != "" ]; then
    API_KEY=$1
fi

# Check if API key is available
if [ -z "$API_KEY" ]; then
    echo "Error: CJF_API_KEY environment variable is not set."
    echo "Please set it using: export CJF_API_KEY=your_api_key"
    echo "Or provide it as an argument: ./update_binary.sh your_api_key"
    exit 1
fi

echo "Requesting binary update from server..."

# Call the PHP script on your website with the API key
RESPONSE=$(curl -s "https://cadenfinley.com/DevToolsTerminal/update_binary_cron_script.php?api_key=$API_KEY")

# Check if the response indicates an error
if [[ $RESPONSE == *"Error:"* ]]; then
    echo "Update process failed:"
    echo "$RESPONSE"
    exit 1
else
    echo "$RESPONSE"
    echo "Binary update process completed."
fi

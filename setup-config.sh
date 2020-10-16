#! /bin/bash
set -e

readNumber() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^[0-9]+$ ]]; then
            break;
        elif [[ -n "$3" ]]; then 
            printf -v $2 "$3" 
            break;
        else 
            echo $'This must be a number'
        fi
    done
}

readRequired() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^.+$ ]]; then
            break;
        elif [[ -n "$3" ]]; then 
            printf -v $2 "$3" 
            break;
        else 
            echo $'This is required'
        fi
    done
}

readBoolean() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^(Y|n)$ ]]; then
            break;
        else 
            echo $'This must be Y or n'
        fi
    done
}

writeFile() {
    JSON_CONFIG=$2
    JSON_FILE=$1
    TMP_FILE="$1.tmp"
    if [[ -f "./config.json" ]]; then
        SCRIPT="console.log(JSON.stringify(Object.assign(require('${JSON_FILE}'),${JSON_CONFIG}),undefined,4))"
        node -e "$SCRIPT" > $TMP_FILE
        rm $JSON_FILE
        mv $TMP_FILE $JSON_FILE
    else 
        node -e "console.log(JSON.stringify(${JSON_CONFIG},undefined,4))" > $JSON_FILE
    fi
}

if [[ -f "./config.json" ]]; then
    readBoolean "A configuration exists. Would you like to override? (Y/n)" OVERRIDE
fi

if [[ "$OVERRIDE" == "n" ]]; then
    echo "Skipping configuration setup..."
    exit 0;
fi

readRequired $'What is the name of the zone?\n' ZONE_NAME
read -p $'Describe the zone? (Optional)\n' ZONE_DESC
readRequired  $'What is the application context root? (Default /api)\n' CONTEXT_ROOT "/api"
readNumber $'What port should I listen on? (Default 8080)\n' APP_PORT 8080
readNumber $'Which GPIO pin is temperature sensor on?\n' GPIO_PIN
readNumber $'How many seconds between temperature checks? (Default 5)\n' INTERVAL_SECS 5
readNumber $'How many seconds between heat call checks? (Default 2)\n' HEAT_INTERVAL_SECS 2
readNumber $'What is the threshold that heating system should run (in F)? (Default 68)\n' HEAT_THRESHOLD 68
readNumber $'What is the threshold that cooling system should run (in F)? (Default 82)\n' COOL_THRESHOLD 82

JSON_CONFIG="{
    \"zoneName\": \"${ZONE_NAME}\",
    \"zoneDescription\": \"${ZONE_DESC}\",
    \"contextRoot\": \"${CONTEXT_ROOT}\",
    \"appPort\": ${APP_PORT},
    \"temperatureSensorPin\": ${GPIO_PIN},
    \"temperatureReportIntervalInSeconds\": $((INTERVAL_SECS )),
    \"checkIntervalInSeconds\": $((HEAT_INTERVAL_SECS ))
}"

THERMOSTAT_CONFIG="{
    \"coolingThreshold\": 5/9*(${COOL_THRESHOLD}-32),
    \"heatThreshold\": 5/9*(${HEAT_THRESHOLD}-32),
    \"margin\": 1
}"

writeFile "./config.json" "$JSON_CONFIG"

./setup-controllers.sh

writeFile "./server/database/settings.json" "$THERMOSTAT_CONFIG"

chmod 777 config.json 
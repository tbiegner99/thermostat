#! /bin/bash
set -e

readNumber() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^[0-9]+$ ]]; then
            break;
        elif [[ -z "${!2}" && -n "$3" ]]; then 
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
        elif [[ -z "${!2}" && -n "$3" ]]; then 
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
        elif [[ -z "${!2}" && -n "$3" ]]; then 
            printf -v $2 "$3" 
            break;   
        else 
            echo $'This must be Y or n'
        fi
    done
}

readWemoConfig() {
    readRequired "Host: " HOST
    readNumber "Port (Default 49153)" PORT 49153

    CONFIG="{
        \"type\": \"wemo\",
        \"host\": \"${HOST}\",
        \"port\": ${PORT}
    }"

    printf -v $1 "$CONFIG"
}

readExternalConfig() {
    readRequired "Module/File: " MODULE

    CONFIG="{
        \"type\": \"external\",
        \"module\": \"${MODULE}\"
    }"

    printf -v $1 "$CONFIG"
}

readGpioControllerConfig(){
    readNumber "Gpio pin number: " PIN_NUMBER
    readBoolean "Invert logic? (Y/n) (Default n)" INVERT  "n"
    if [[ "$INVERT" == "n" ]]; then
        INVERT="false"
    else 
        INVERT="true"
    fi

    CONFIG="{
        \"type\": \"gpio\",
        \"pin\": ${PIN_NUMBER},
        \"invertedLogic\": ${INVERT}
    }"

    printf -v $1 "$CONFIG"
    
}

readControllerConfig() {
    echo $1
    echo "Enter a controller type:"
    echo "1. GPIO - sends a high signal out of the gpio pin to turn on. The logic may also be inverted."
    echo "2. Wemo - control power to a Belkin wemo device"
    echo "3. External - a custom module. enter either the name of a node module or a js class implementing the HeatingController interface"
    echo "4. None - Exclude this system"
    while true; do
        readNumber "Enter Choice (1-4): " CHOICE
        if ((CHOICE >= 1 && CHOICE <= 4)); then
            break;
        fi
        echo "Number out of range."
    done;
    
    case $CHOICE in
        1)
            readGpioControllerConfig $2
            ;;
        2) 
            readWemoConfig $2
            ;;
        3)
            readExternalConfig $2
            ;;
        4)
            printf -v $2 "null"
    esac
}

if [[ ! -f "./config.json" ]]; then
    echo "No config exists. run setup-config.sh first";
    exit 1 
fi

readControllerConfig "Configuring Heating Controller..." HEATING_CONTROLLER_CONFIG
readControllerConfig "Configuring Cooling Controller..." COOLING_CONTROLLER_CONFIG

JSON_CONFIG="{
    \"controllers\": {
        \"heating\": ${HEATING_CONTROLLER_CONFIG},
        \"cooling\": ${COOLING_CONTROLLER_CONFIG}
    }
}"


if [[ -f "./config.json" ]]; then
    node -e "console.log(JSON.stringify(Object.assign(require('./config.json'),${JSON_CONFIG}),undefined,4))" > config_new.json
    rm config.json
    mv config_new.json config.json
fi

chmod 777 config.json 
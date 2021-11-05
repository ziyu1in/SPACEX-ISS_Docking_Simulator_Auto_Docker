(function() {
    /**
     * If this script is injected into the same tab again,
     * it will do nothing next time.
     */
    if (window.hasRun === "hadRun")
        return true;
    window.hasRun = "hadRun";

    function getStates() {
        let pitchAngle = parseFloat(document.querySelector("#pitch > div.error").childNodes[0].textContent);
        let rollAngle = parseFloat(document.querySelector("#roll > div.error").childNodes[0].textContent);
        let yawAngle = parseFloat(document.querySelector("#yaw > div.error").childNodes[0].textContent);

        let pitchRate = parseFloat(document.querySelector("#pitch > div.rate").childNodes[0].textContent);
        let rollRate = parseFloat(document.querySelector("#roll > div.rate").childNodes[0].textContent);
        let yawRate = parseFloat(document.querySelector("#yaw > div.rate").childNodes[0].textContent);

        let xCoordinate = parseFloat(document.querySelector("#x-range > div").childNodes[0].textContent);
        let yCoordinate = parseFloat(document.querySelector("#y-range > div").childNodes[0].textContent);
        let zCoordinate = parseFloat(document.querySelector("#z-range > div").childNodes[0].textContent);

        let range = parseFloat(document.querySelector("#range > div.rate").childNodes[0].textContent);
        let rate = parseFloat(document.querySelector("#rate > div.rate").childNodes[0].textContent);
        
        let statesDict = {
            "pitchAngle": pitchAngle,
            "rollAngle": rollAngle,
            "yawAngle": yawAngle,
            "pitchRate": pitchRate,
            "rollRate": rollRate,
            "yawRate": yawRate,
            "xCoordinate": xCoordinate,
            "yCoordinate": yCoordinate,
            "zCoordinate": zCoordinate,
            "range": range,
            "rate": rate
        };

        return statesDict;
    }
    
    function pitchStateMachine(shipStates) {
        let pitchState;
        if (shipStates["pitchAngle"] > 0) {
            if (shipStates["pitchRate"] == 0) {
                pitchState = "pDown1"
            }
            else if (shipStates["pitchRate"] < 0) {
                pitchState = "pDownx"
            }
            else {
                pitchState = "pDown0"
            }
        }
        else if (shipStates["pitchAngle"] < 0) {
            if (shipStates["pitchRate"] == 0) {
                pitchState = "pUp1"
            }
            else if (shipStates["pitchRate"] > 0) {
                pitchState = "pUpx"
            }
            else {
                pitchState = "pUp0"
            }
        }
        else {
            if (shipStates["pitchRate"] > 0) {
                pitchState = "pFinU"
            }
            else if (shipStates["pitchRate"] < 0) {
                pitchState = "pFinD"
            }
            else {
                pitchState = "pFin0"
            }
        }
        return pitchState;
    }

    function rollStateMachine(shipStates) {
        let rollState;
        if (shipStates["rollAngle"] > 0) {
            if (shipStates["rollRate"] == 0) {
                rollState = "rRight1"
            }
            else if (shipStates["rollRate"] < 0) {
                rollState = "rRightx"
            }
            else {
                rollState = "rRight0"
            }
        }
        else if (shipStates["rollAngle"] < 0) {
            if (shipStates["rollRate"] == 0) {
                rollState = "rLeft1"
            }
            else if (shipStates["rollRate"] > 0) {
                rollState = "rLeftx"
            }
            else {
                rollState = "rLeft0"
            }
        }
        else {
            if (shipStates["rollRate"] > 0) {
                rollState = "rFin+"
            }
            else if (shipStates["rollRate"] < 0) {
                rollState = "rFin-"
            }
            else {
                rollState = "rFin0"
            }
        }
        return rollState;
    }
    
    function yawStateMachine(shipStates) {
        // let shipStates = getStates();
        let yawState;
        if (shipStates["yawAngle"] > 0) {
            if (shipStates["yawRate"] == 0) {
                yawState = "yRight1"
            }
            else if (shipStates["yawRate"] < 0) {
                yawState = "yRightx"
            }
            else {
                yawState = "yRight0"
            }
        }
        else if (shipStates["yawAngle"] < 0) {
            if (shipStates["yawRate"] == 0) {
                yawState = "yLeft1"
            }
            else if (shipStates["yawRate"] > 0) {
                yawState = "yLeftx"
            }
            else {
                yawState = "yLeft0"
            }
        }
        else {
            if (shipStates["yawRate"] > 0) {
                yawState = "yFinL"
            }
            else if (shipStates["yawRate"] < 0) {
                yawState = "yFinR"
            }
            else {
                yawState = "yFin0"
            }
        }
        return yawState;
    }

    function rollControlSmall(rollStateNow) {

        switch(rollStateNow) {
            case "rRight1":
                document.querySelector("#roll-right-button").click();
                break;
            case "rRightx":
                document.querySelector("#roll-right-button").click();
                document.querySelector("#roll-right-button").click();
                break;
            case "rRight0":
                break;
            case "rLeft1":
                document.querySelector("#roll-left-button").click();
                break;
            case "rLeftx":
                document.querySelector("#roll-left-button").click();
                document.querySelector("#roll-left-button").click();
                break;
            case "rLeft0":
                break;
            case "rFin+":
                document.querySelector("#roll-left-button").click();
                break;
            case "rFin-":
                document.querySelector("#roll-right-button").click();
                break;
            case "rFin0":
                break;
        }
    }

    function yawControlSmall(yawStateNow) {

        switch(yawStateNow) {
            case "yRight1":
                document.querySelector("#yaw-right-button").click();
                break;
            case "yRightx":
                document.querySelector("#yaw-right-button").click();
                document.querySelector("#yaw-right-button").click();
                break;
            case "yRight0":
                break;
            case "yLeft1":
                document.querySelector("#yaw-left-button").click();
                break;
            case "yLeftx":
                document.querySelector("#yaw-left-button").click();
                document.querySelector("#yaw-left-button").click();
                break;
            case "yLeft0":
                break;
            case "yFinL":
                document.querySelector("#yaw-left-button").click();
                break;
            case "yFinR":
                document.querySelector("#yaw-right-button").click();
                break;
            case "yFin0":
                break;
        }
    }

    function pitchControlSmall(pitchStateNow) {

        switch(pitchStateNow) {
            case "pDown1":
                document.querySelector("#pitch-down-button").click();
                break;
            case "pDownx":
                document.querySelector("#pitch-down-button").click();
                document.querySelector("#pitch-down-button").click();
                break;
            case "pDown0":
                break;
            case "pUp1":
                document.querySelector("#pitch-up-button").click();
                break;
            case "pUpx":
                document.querySelector("#pitch-up-button").click();
                document.querySelector("#pitch-up-button").click();
                break;
            case "pUp0":
                break;
            case "pFinU":
                document.querySelector("#pitch-up-button").click();
                break;
            case "pFinD":
                document.querySelector("#pitch-down-button").click();
                break;
            case "pFin0":
                break;
        }
    }

    function attitudeStateMachine() {
        let shipStates = getStates();
        let pitchStateNow = pitchStateMachine(shipStates);
        let rollStateNow = rollStateMachine(shipStates);
        let yawStateNow = yawStateMachine(shipStates);

        let attitudeDict = {
            "pitchStateNow": pitchStateNow,
            "rollStateNow": rollStateNow,
            "yawStateNow": yawStateNow
        }
        return attitudeDict;
    }

    function attitudeControlSmall(shipStates) {
        let shipAttitude = attitudeStateMachine(shipStates);

        pitchControlSmall(shipAttitude["pitchStateNow"]);
        rollControlSmall(shipAttitude["rollStateNow"]);
        yawControlSmall(shipAttitude["yawStateNow"]);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runController() {
        let shipStates = getStates();
        let attitudeDict = attitudeStateMachine(shipStates);

        while ((attitudeDict["yawStateNow"] !== "yFin0") || (attitudeDict["pitchStateNow"] !== "pFin0")) {
            attitudeControlSmall(shipStates);
            await sleep(100);
            shipStates = getStates();
            attitudeDict = attitudeStateMachine(shipStates);
        }

    }

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.command === "start") 
                runController();
            else
                alert("The controller has not started yet!");
        }
        );


})();

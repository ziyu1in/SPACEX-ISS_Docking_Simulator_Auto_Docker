(function() {
    /**
     * If this script is injected into the same tab again,
     * it will do nothing next time.
     */
    if (window.hasRun === "hadRun")
        return true;
    window.hasRun = "hadRun";

    let kPX = 0.1;
    let kIX = 0.0001;
    let kDX = 0.35;
    let kPY = 0.1;
    let kIY = 0.0001;
    let kDY = 0.25;
    let kPZ = 0.1;
    let kIZ = 0.0001;
    let kDZ = 0.2;
    let kPPitch = 0.1;
    let kIPitch = 0;
    let kDPitch = 0;
    let kPRoll = 0.1;
    let kIRoll = 0;
    let kDRoll = 0;
    let kPYaw = 0.1;
    let kIYaw = 0;
    let kDYaw = 0;

    let dt = 0.1;

    let xPast = 0;
    let yPast = 0;
    let zPast = 0;
    let pitchPast = 0;
    let xErrorPast = 0;
    let yErrorPast = 0;
    let zErrorPast = 0;
    let pitchErrorPast = 0;
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    let pitchSum = 0;
    let rollSum = 0;
    let yawSum = 0;

    let pitchClickTimes = 5;
    let yawClickTimes = 5;
    let rollClickTimes = 5;

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

    function pitchPID(shipStates) {
        let pitch = shipStates["pitchAngle"];
        let pitchRate = shipStates["pitchRate"];
        let pitchError = pitch;
        let pitchI = (pitchError + pitchErrorPast)* dt / 2;
        pitchSum += pitchI;
        let pitchD = (pitchError + pitchErrorPast)/dt;
        let pitchInput;
        pitchInput = kPPitch * pitchError + kIPitch * pitchSum + kDPitch * pitchD;
        for (let i = 0; i < (Math.abs(pitchInput - pitchRate) / 0.1); i++) {
            if (pitchInput < pitchRate) {
                document.querySelector("#pitch-up-button").click();
            }
            else if (pitchInput > pitchRate) {
                document.querySelector("#pitch-down-button").click();
            }
        }
        pitchPast = pitch
        pitchErrorPast = pitchError;
    }

    function rollPID(shipStates) {
        let roll = shipStates["rollAngle"];
        let rollRate = shipStates["rollRate"];
        let rollError = roll;
        let rollI = (rollError + rollErrorPast)* dt / 2;
        rollSum += rollI;
        let rollD = (rollError + rollErrorPast)/dt;
        let rollInput;
        rollInput = kPRoll * rollError + kIRoll * rollSum + kDRoll * rollD;
        for (let i = 0; i < (Math.abs(rollInput - rollRate) / 0.1); i++) {
            if (rollInput < rollRate) {
                document.querySelector("#roll-left-button").click();
            }
            else if (rollInput > rollRate) {
                document.querySelector("#roll-right-button").click();
            }
        }
        rollPast = roll
        rollErrorPast = rollError;
    }

    function yawPID(shipStates) {
        let yaw = shipStates["yawAngle"];
        let yawRate = shipStates["yawRate"];
        let yawError = yaw;
        let yawI = (yawError + yawErrorPast)* dt / 2;
        yawSum += yawI;
        let yawD = (yawError + yawErrorPast)/dt;
        let yawInput;
        yawInput = kPYaw * yawError + kIYaw * yawSum + kDYaw * yawD;
        for (let i = 0; i < (Math.abs(yawInput - yawRate) / 0.1); i++) {
            if (yawInput < yawRate) {
                document.querySelector("#yaw-left-button").click();
            }
            else if (yawInput > yawRate) {
                document.querySelector("#yaw-right-button").click();
            }
        }
        yawPast = yaw
        yawErrorPast = yawError;
    }

    // function pitchPID(shipStates) {
    //     let pitch = shipStates["pitchAngle"];
    //     let pitchRate = shipStates["pitchRate"];
    //     let pitchError = pitch;
    //     let pitchI = (pitchError + pitchErrorPast)* dt / 2;
    //     pitchSum += pitchI;
    //     let pitchD = (pitchError + pitchErrorPast)/dt;
    //     let pitchInput;
    //     pitchInput = kPPitch * pitchError + kIPitch * pitchSum + kDPitch * pitchD;
    //     for (let i = 0; i < (Math.abs(pitchInput - pitchRate) / 0.1); i++) {
    //         if (pitchInput < pitchRate) {
    //             document.querySelector("#pitch-up-button").click();
    //         }
    //         else if (pitchInput > pitchRate) {
    //             document.querySelector("#pitch-down-button").click();
    //         }
    //     }
    //     pitchPast = pitch
    //     pitchErrorPast = pitchError;
    // }

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

        if (Math.abs(shipStates["pitchAngle"]) < 1) {
            pitchClickTimes = 1;
        }
        if (Math.abs(shipStates["rollAngle"]) < 1) {
            rollClickTimes = 1;
        }
        if (Math.abs(shipStates["yawAngle"]) < 1) {
            yawClickTimes = 1;
        }

        return attitudeDict;
    }

    function attitudeControlSmall(shipStates) {
        let shipAttitude = attitudeStateMachine(shipStates);
        for (let click = 0; click < pitchClickTimes; click++) {
            pitchControlSmall(shipAttitude["pitchStateNow"]);
        }
        for (let click = 0; click < rollClickTimes; click++) {
            rollControlSmall(shipAttitude["rollStateNow"]);
        }
        for ( let click = 0; click < yawClickTimes; click++) {
            yawControlSmall(shipAttitude["yawStateNow"]);
        }
    }

    function xyzPID(shipStates) {
        let x = shipStates["xCoordinate"]
        let xRate = (x - xPast)/dt;
        let y = shipStates["yCoordinate"]
        let yRate = (y - yPast)/dt;
        let z = shipStates["zCoordinate"]
        let zRate = (z - zPast)/dt;
        let rate = shipStates["rate"]
        
        if (Math.abs(y/x) < 0.1 && Math.abs(z/x) < 0.1) {
            if (Math.abs(y) < 0.3 && Math.abs(z) < 0.3) {
                xPID(x,rate);
            }
            else {
                xPID(x,xRate);
            }
        }
        else {
            if (x < 170) {
                document.querySelector("#translate-backward-button").click();
            }
            else if (x > 230) {
                document.querySelector("#translate-forward-button").click();
            }
        }
        yPID(y,yRate);
        zPID(z,zRate);
    }

    function xPID(x,xRate) {
        if (Math.abs(x) > 5) {
            let xError = 0 - x;
            let xI = (xError + xErrorPast)* dt / 2;
            xSum += xI;
            let xD = (xError - xErrorPast)/dt;
            let xInput;
            xInput = kPX * xError + kIX * xSum + kDX * xD;
            if (xInput < xRate) {
                document.querySelector("#translate-forward-button").click();
            }
            else if (xInput > xRate) {
                document.querySelector("#translate-backward-button").click();
            }
            xPast = x;
            xErrorPast = xError;
        }
        else {
            if (xRate > -0.09) {
                document.querySelector("#translate-forward-button").click();
            }
            else if (xRate < -0.16) {
                document.querySelector("#translate-backward-button").click();
            }
        xPast = x;
        }
    }

    function yPID(y,yRate) {
        if (Math.abs(y) > 1) {
            let yError = 0 - y;
            let yI = (yError + yErrorPast)* dt / 2;
            ySum += yI;
            let yD = (yError - yErrorPast)/dt;
            let yInput = kPY * yError + kIY * ySum + kDY * yD;
            if (yInput < yRate) {
                document.querySelector("#translate-left-button").click();
            }
            else if (yInput > yRate) {
                document.querySelector("#translate-right-button").click();
            }
            yPast = y;
            yErrorPast = yError;
        }
        else {
            if (y > 0) {
                if (yRate == 0) {
                    document.querySelector("#translate-left-button").click();
                }
                else if (yRate > 0) {
                    document.querySelector("#translate-left-button").click();
                    document.querySelector("#translate-left-button").click();
                }
            }
            else if (y < 0) {
                if (yRate == 0) {
                    document.querySelector("#translate-right-button").click();
                }
                else if (yRate < 0) {
                    document.querySelector("#translate-right-button").click();
                    document.querySelector("#translate-right-button").click();
                }
            }
            else {
                if (yRate > 0) {
                    document.querySelector("#translate-left-button").click();
                }
                else if (yRate < 0) {
                    document.querySelector("#translate-right-button").click();
                }
            }
            yPast = y;
        }
    }

    function zPID(z,zRate) {
        if (Math.abs(z) > 1) {
            let zError = 0 - z;
            let zI = (zError + zErrorPast)* dt / 2;
            zSum += zI;
            let zD = (zError - zErrorPast)/dt;
            let zInput = kPZ * zError + kIZ * zSum + kDZ * zD;
            if (zInput < zRate) {
                document.querySelector("#translate-down-button").click();
            }
            else if (zInput > zRate) {
                document.querySelector("#translate-up-button").click();
            }
            zPast = z;
            zErrorPast = zError;
        }
        else {
            if (z > 0) {
                if (zRate == 0) {
                    document.querySelector("#translate-down-button").click();
                }
                else if (zRate > 0) {
                    document.querySelector("#translate-down-button").click();
                    document.querySelector("#translate-down-button").click();
                }
            }
            else if (z < 0) {
                if (zRate == 0) {
                    document.querySelector("#translate-up-button").click();
                }
                else if (zRate <0) {
                    document.querySelector("#translate-up-button").click();
                    document.querySelector("#translate-up-button").click();
                }
            }
            else {
                if (zRate > 0) {
                    document.querySelector("#translate-down-button").click();
                }
                else if (zRate < 0) {
                    document.querySelector("#translate-up-button").click();
                }
            }
            zPast = z;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runController() {
        let shipStates = getStates();
        let attitudeDict = attitudeStateMachine(shipStates);
        xPast = shipStates["xCoordinate"];
        xErrorPast = 0 - xPast;
        yPast = shipStates["yCoordinate"];
        yErrorPast = 0 - yPast;
        zPast = shipStates["zCoordinate"];
        zErrorPast = 0 - zPast;
        pitchPast = shipStates["pitchAngle"];
        pitchErrorPast = pitchPast;
        rollPast = shipStates["rollAngle"];
        rollErrorPast = rollPast;
        yawPast = shipStates["yawAngle"];
        yawErrorPast = yawPast;
        while ((attitudeDict["yawStateNow"] !== "yFin0") || 
        (attitudeDict["pitchStateNow"] !== "pFin0") || 
        (attitudeDict["rollStateNow"] !== "rFin0") ||
        (shipStates["range"] !== 0)) {
            // attitudeControlSmall(shipStates);
            pitchPID(shipStates);
            // rollPID(shipStates);
            if (Math.abs(shipStates["pitchAngle"]) < 10 && 
            Math.abs(shipStates["rollAngle"]) < 10 &&
            Math.abs(shipStates["yawAngle"]) < 10) {
                xyzPID(shipStates);
            }
            await sleep(dt*1000);
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

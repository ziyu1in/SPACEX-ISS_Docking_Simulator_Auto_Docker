(function() {
    /**
     * If this script is injected into the same tab again,
     * it will do nothing next time.
     */
    if (window.hasRun === "hadRun")
        return true;
    window.hasRun = "hadRun";

// proportional gain on x
    let KP_X = 0.1;
// intergral gain on x
    let kIX = 0.0001;
// derivative gain on x
    let kDX = 0.35;
// 
    let kPY = 0.1;
    let kIY = 0.0001;
    let kDY = 0.25;
    let kPZ = 0.1;
    let kIZ = 0.0001;
    let kDZ = 0.2;
// proportional gain on pitch
    let kPPitch = 0.1;
    // let kIPitch = 0;
    // let kDPitch = 0;
// 
    let kPRoll = 0.1;
    // let kIRoll = 0;
    // let kDRoll = 0;
// 
    let kPYaw = 0.1;
    // let kIYaw = 0;
    // let kDYaw = 0;

// time step [second]
    let DT = 0.1;

// x, y, z value in previous iteration
    let xPast = 0;
    let yPast = 0;
    let zPast = 0;

// pitch, roll, yaw angle in previous iteration 
    let pitchPast = 0;
    let rollPast = 0;
    let yawPast= 0;

// x, y, z error in previous iteration
    let xErrorPast = 0;
    let yErrorPast = 0;
    let zErrorPast = 0;

// x, y, z error intergral
    let xSum = 0;
    let ySum = 0;
    let zSum = 0;

    // let pitchClickTimes = 5;
    // let yawClickTimes = 5;
    // let rollClickTimes = 5;
    // let pitchErrorPast = 0;
    // let rollErrorPast = 0;
    // let yawErrorPast = 0;   
    // let pitchSum = 0;
    // let rollSum = 0;
    // let yawSum = 0; 

// pitchPID() proportionally controls the regulating speed of pitch
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: void
// example
    // let shipStates = getStates();
    // pitchPID(shipStates);

    function pitchPID(shipStates) {
        let pitch = shipStates["pitchAngle"];
        let pitchRate = shipStates["pitchRate"];
        let pitchError = pitch;
        // let pitchI = (pitchError + pitchErrorPast)* DT / 2;
        // pitchSum += pitchI;
        // let pitchD = (pitchError + pitchErrorPast)/DT;
        let pitchInput;
        pitchInput = kPPitch * pitchError /* + kIPitch * pitchSum + kDPitch * pitchD */;
        for (let i = 0; i < (Math.abs(pitchInput - pitchRate) / 0.1); i++) {
            if (pitchInput < pitchRate) {
                document.querySelector("#pitch-up-button").click();
            }
            else if (pitchInput > pitchRate) {
                document.querySelector("#pitch-down-button").click();
            }
        }
        pitchPast = pitch
        // pitchErrorPast = pitchError;
    }

// rollPID() proportionally controls the regulating speed of roll
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: void
// example
    // let shipStates = getStates();
    // rollPID(shipStates);

    function rollPID(shipStates) {
        let roll = shipStates["rollAngle"];
        let rollRate = shipStates["rollRate"];
        let rollError = roll;
        // let rollI = (rollError + rollErrorPast)* DT / 2;
        // rollSum += rollI;
        // let rollD = (rollError + rollErrorPast)/DT;
        let rollInput;
        rollInput = kPRoll * rollError /* + kIRoll * rollSum + kDRoll * rollD */;
        for (let i = 0; i < (Math.abs(rollInput - rollRate) / 0.1); i++) {
            if (rollInput < rollRate) {
                document.querySelector("#roll-left-button").click();
            }
            else if (rollInput > rollRate) {
                document.querySelector("#roll-right-button").click();
            }
        }
        rollPast = roll
        // rollErrorPast = rollError;
    }

// yawPID() proportionally controls the regulating speed of yaw
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: void
// example
    // let shipStates = getStates();
    // yawPID(shipStates);

    function yawPID(shipStates) {
        let yaw = shipStates["yawAngle"];
        let yawRate = shipStates["yawRate"];
        let yawError = yaw;
        // let yawI = (yawError + yawErrorPast)* DT / 2;
        // yawSum += yawI;
        // let yawD = (yawError + yawErrorPast)/DT;
        let yawInput;
        yawInput = kPYaw * yawError /* + kIYaw * yawSum + kDYaw * yawD */;
        for (let i = 0; i < (Math.abs(yawInput - yawRate) / 0.1); i++) {
            if (yawInput < yawRate) {
                document.querySelector("#yaw-left-button").click();
            }
            else if (yawInput > yawRate) {
                document.querySelector("#yaw-right-button").click();
            }
        }
        yawPast = yaw
        // yawErrorPast = yawError;
    }

// xPID() controlls the speed as of x axis to the ISS base on proportion, intergral and derivative
// base on the distance to the ISS and the velocity as of x axis
// input: x, xRate
    // x being the distance as of x axis between the ship and the ISS
    // xRate being the velocity as of x axis of the ship regarding the ISS
// output: void
// example
    // let x = shipStates["xCoordinate"];
    // let xRate = (x - xPast)/DT;
    // xPID(x,xRate);

    function xPID(x,xRate) {
        if (Math.abs(x) > 5) {
            let xError = 0 - x;
            let xI = (xError + xErrorPast)* DT / 2;
            xSum += xI;
            let xD = (xError - xErrorPast)/DT;
            let xInput;
            xInput = KP_X * xError + kIX * xSum + kDX * xD;
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
            else if (xRate < -0.16) { /* input magnitude is too large at final stage */
                document.querySelector("#translate-backward-button").click();
            }
        xPast = x;
        }
    }

// yPID() controlls the speed as of y axis to the ISS base on proportion, intergral and derivative
// base on the distance to the ISS and the velocity as of x axis
// input: y, yRate
    // y being the distance as of y axis between the ship and the ISS
    // yRate being the velocity as of y axis of the ship regarding the ISS
// output: void
// example
    // let y = shipStates["yCoordinate"];
    // let yRate = (y - yPast)/DT;
    // yPID(y,yRate);

    function yPID(y,yRate) {
        if (Math.abs(y) > 1) {
            let yError = 0 - y;
            let yI = (yError + yErrorPast)* DT / 2;
            ySum += yI;
            let yD = (yError - yErrorPast)/DT;
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

// zPID() controlls the speed as of z axis to the ISS base on proportion, intergral and derivative
// base on the distance to the ISS and the velocity as of x axis
// input: z, zRate
    // z being the distance as of z axis between the ship and the ISS
    // zRate being the velocity as of z axis of the ship regarding the ISS
// output: void
// example
    // let z = shipStates["zCoordinate"];
    // let zRate = (z - zPast)/DT;
    // zPID(z,zRate);

    function zPID(z,zRate) {
        if (Math.abs(z) > 1) {
            let zError = 0 - z;
            let zI = (zError + zErrorPast)* DT / 2;
            zSum += zI;
            let zD = (zError - zErrorPast)/DT;
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

// xyzPID() triggers xPID(), yPID(), and zPID(), also providing distance and calculated velocity as of each axes;
// when yRate and zRate are negligible, feed xPID() with precise rate instead of the calculated xRate.
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: void
// example
    // let shipStates = shipStates(statesDict);
    // xyzPID(shipStates);

    function xyzPID(shipStates) {
        let x = shipStates["xCoordinate"]
        let xRate = (x - xPast)/DT;
        let y = shipStates["yCoordinate"]
        let yRate = (y - yPast)/DT;
        let z = shipStates["zCoordinate"]
        let zRate = (z - zPast)/DT;
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

// by which the main thread doesn't block

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // getStates() gets the position and attitude date of the ship,
// and returns a dictionary variable
// input: void
// output: statesDict
    // a dictionary of all the data of the ship
// example
    // let statesDict = getStates();
    // let pitchAngle = statesDict["pitchAngle"];

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

// pitchStateMachine() assigns states based on the attitude data of the ship
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: pitchState
    // string that indicates the various states corresponding to the pitch data
// example
    // let shipStates = getStates();
    // let pitchState = pitchStateMachine(shipStates);

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

// rollStateMachine() assigns states based on the attitude data of the ship
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: rollState
    // string that indicates the various states corresponding to the roll data
// example
    // let shipStates = getStates();
    // let rollState = rollStateMachine(shipStates);

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
    
// yawStateMachine() assigns states based on the attitude data of the ship
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: yawState
    // string that indicates the various states corresponding to the yaw data
// example
    // let shipStates = getStates();
    // let yawState = yawStateMachine(shipStates);

    function yawStateMachine(shipStates) {
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

// rollControlSmall() was intended to use as an precision control when the roll error is small, 
// it alters ship attitude based on the states defined in rollStateMachine
// input: rollStateNow
    // string that indicates the finite state of roll currently
// output: void
// example
    // let shipStates = getStates();
    // let rollState = rollStateMachine(shipStates);
    // rollControlSmall();

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

// yawControlSmall() was intended to use as an precision control when the yaw error is small, 
// it alters ship attitude based on the states defined in yawStateMachine
// input: yawStateNow
    // string that indicates the finite state of yaw currently
// output: void
// example
    // let shipStates = getStates();
    // let yawState = yawStateMachine(shipStates);
    // yawControlSmall();

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

// pitchControlSmall() was intended to use as an precision control when the pitch error is small, 
// it alters ship attitude based on the states defined in pitchStateMachine
// input: pitchStateNow
    // string that indicates the finite state of pitch currently
// output: void
// example
    // let shipStates = getStates();
    // let pitchState = pitchStateMachine(shipStates);
    // pitchControlSmall();

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

// attitudeStateMachine() access the current attitude data of the ship,
// and returns the attitude finite state of pitch, roll and yaw;
// reduces regulating speed when either angle approches 0.
// input: void
// output: attitudeDict
    // a dictionary that includes the finite state of pitch, roll, and yaw
// example
    // let attitudeDict = attitudeStateMachine();
    // let pitchStateNow = attitudeDict["pitchStateNow"];

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

// attitudeControlSmall() was inteneded as the controller which triggers the small control of pitch, roll, and yaw;
// it also accelerate the regulating speed from initial position.
// input: statesDict
    // a dictionary aforementioned that includes all the states of the ship
// output: void
// example
    // let shipStates = getStates();
    // attitudeControlSmall(shipStates);

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

// This is the main function

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
        // pitchErrorPast = pitchPast;
        rollPast = shipStates["rollAngle"];
        // rollErrorPast = rollPast;
        yawPast = shipStates["yawAngle"];
        // yawErrorPast = yawPast;
        while ((attitudeDict["yawStateNow"] !== "yFin0") || 
        (attitudeDict["pitchStateNow"] !== "pFin0") || 
        (attitudeDict["rollStateNow"] !== "rFin0") ||
        (shipStates["range"] !== 0)) {
            // attitudeControlSmall(shipStates);
            pitchPID(shipStates);
            rollPID(shipStates);
            yawPID(shipStates);
            if (Math.abs(shipStates["pitchAngle"]) < 10 && 
            Math.abs(shipStates["rollAngle"]) < 10 &&
            Math.abs(shipStates["yawAngle"]) < 10) {
                xyzPID(shipStates);
            }
            await sleep(DT*1000);
            shipStates = getStates();
            // attitudeDict = attitudeStateMachine(shipStates);
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

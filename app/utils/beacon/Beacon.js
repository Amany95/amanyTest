export default class Beacon {
    stable = false;

    constructor({minor, major, rssi, accuracy, proximity, floor_no, node, neighbours, coordinate}) {
        this.minor = minor;
        this.major = major;
        this.rssi = rssi;
        this.accuracy = accuracy;
        this.proximity = proximity;
        this.floor_no = floor_no;
        this.node = node;
        this.neighbours = neighbours;
        this.coordinate = coordinate;
    }

    update({rssi, accuracy, proximity, floor_no}) {
        this.beaconReceived();

        if (rssi) {
            this.rssi = rssi === 0 ? -99 : rssi;
        }

        if (accuracy) {
            this.accuracy = accuracy === -1 ? 10 : accuracy;
        }

        if (proximity) {
            this.proximity = proximity;
        }

        if (floor_no) {
            this.floor_no = floor_no;
        }
    }

    beaconReceived = () => {
        if (this.accuracy === -1 || this.accuracy === 10)
            return;

        if (this.floor_no === undefined || !this.floor_no)
            return;

        this.stable = true;
    };

    beaconNotReceive = () => {
        this.stable = false;
    };

    getJson = () => {
        return {
            minor: this.minor,
            major: this.major,
            rssi: this.rssi,
            accuracy: this.accuracy,
            proximity: this.proximity,
            stable: this.stable,
            floor_no: this.floor_no,
            node: this.node,
            neighbours: this.neighbours,
            coordinate: this.coordinate
        };
    }
}

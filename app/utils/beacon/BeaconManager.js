/* eslint-disable camelcase */
import _ from "lodash";
import PropTypes from "prop-types";
import Beacon from "./Beacon";

class BeaconManager {
    beacons = [];
    floor_no = [];
    levelCounter = 0;
    stableBeacon;
    stableBeacons = [];
    stableBeaconNotFound = 0;

    beaconLevelData = (beaconLevelData) => {
        this.beaconExtraData = beaconLevelData;
    };

    setNodesData = (nodesData) => {
        this.nodesData = nodesData;
    };

    recievedBeacons = (beacons) => {
        // first load

        if (this.beacons.length === 0) {
            this.beacons = beacons.map((beacon) => {
                const find = _.find(this.beaconExtraData, {minor: beacon.minor});

                if (!find) {
                    return;
                }

                if (!find.node_name) {
                    return;
                }

                const nodeData = _.find(this.nodesData, {node: find.node_name});

                beacon.accuracy = beacon.accuracy || beacon.distance;

                return new Beacon({...find, ...nodeData, ...beacon});
            });

            this.beacons = this.beacons.filter((bcn) => bcn !== undefined);

            return;
        }

        let ReceivedBeacons = beacons;

        if (beacons.length > 0) {
            this.beacons = this.beacons.map((beacon) => {
                let newBeacon = _.find(ReceivedBeacons, {minor: beacon.minor});

                // Remove found the beacon
                ReceivedBeacons = ReceivedBeacons.filter((bcn) => bcn.minor !== beacon.minor);

                if (newBeacon) {
                    newBeacon.accuracy = newBeacon.accuracy || newBeacon.distance;
                    if (!beacon.floor_no) {
                        const find = _.find(this.beaconExtraData, {minor: beacon.minor});

                        if (!find) {
                            beacon.beaconNotReceive();
                            return;
                        }
                        newBeacon = {...newBeacon, ...find};
                    }

                    beacon.update(newBeacon);
                    return beacon;
                }
                else {
                    // beacon away to area
                    beacon.beaconNotReceive();
                    return beacon;
                }
            });

            // Received new Beacons
            ReceivedBeacons.map((beacon) => {
                const find = _.find(this.beaconExtraData, {minor: beacon.minor});

                if (!find) {
                    return;
                }

                if (!find.node_name) {
                    return;
                }

                const nodeData = _.find(this.nodesData, {node: find.node_name});

                beacon.accuracy = beacon.accuracy || beacon.distance;

                this.beacons.push(new Beacon({...find, ...nodeData, ...beacon}));
            });
        }
        else {
            this.beacons.map((beacon) => {
                beacon.beaconNotReceive();
            });
        }
        if (this.beacons) {
            this.getStableBeacon();
        }
    };

    // we dont need this level calculator so we calculate to just stableBeacons
    // and use the neighbours stable beacon

    getStableBeacon = () => {
        this.getNeighboursToStableBeacon();

        const allStableBeacons = [...this.stableBeacons];

        if (this.stableBeacon && allStableBeacons.filter((stableBcn) => {
            return stableBcn.minor === this.stableBeacon.minor;
        }).length === 0) {
            allStableBeacons.push(this.stableBeacon);
        }

        if (allStableBeacons.length > 0) {
            // now we find the most near beacon
            allStableBeacons.filter((bcn) => {
                return bcn.stable;
            }).sort((a, b) => {
                return a.accuracy > b.accuracy;
            });

            this.stableBeacon = allStableBeacons[0];
        }

        if (this.stableBeacon) {
            if (!this.stableBeacon.accuracy == 10 && this.beacons.length > 0) {
                this.stableBeacons = this.getJsonByBeacons(this.beacons.filter((beacon) => {
                    return beacon.stable;
                }).sort((a, b) => {
                    return a.accuracy > b.accuracy;
                }));

                this.stableBeacon = this.stableBeacons[0];

                if (!this.stableBeacon) {
                    this.stableBeaconNotFound = 0;
                }
            }
            else {
                this.stableBeaconNotFound += 1;
            }
        }

        return this.stableBeacon;
    };

    getNeighboursToStableBeacon = () => {
        if (this.beacons) {
            this.stableBeacons = this.getJsonByBeacons(this.beacons.filter((beacon) => {
                return beacon.stable;
            })).sort((a, b) => {
                return a.accuracy > b.accuracy;
            });

            if (this.stableBeacon && this.stableBeacon.accuracy == 10) {
                this.stableBeacon = this.stableBeacons[0];
                return this.stableBeacons;
            }

            if (this.stableBeacon && this.stableBeacon.neighbours) {
                const newStableBeacons = [];

                this.stableBeacon.neighbours.disabled.forEach((node) => {
                    const relatedBeacon = _.find(this.stableBeacons, {node});

                    newStableBeacons.push(relatedBeacon);
                });

                this.stableBeacon.neighbours.pedestrian.forEach((node) => {
                    const relatedBeacon = _.find(this.stableBeacons, {node});

                    newStableBeacons.push(relatedBeacon);
                });

                newStableBeacons.sort((a, b) => {
                    return a.accuracy > b.accuracy;
                });

                return newStableBeacons.length > 0 ? newStableBeacons : this.stableBeacons;
            }
            else {
                this.stableBeacon = this.stableBeacons[0];
            }

            return this.stableBeacons;
        }

        return [];
    };

    getStableBeacons = () => {
        if (this.stableBeacon && this.stableBeacons.filter((stableBcn) => {
            return stableBcn.minor === this.stableBeacon.minor;
        }).length === 0) {
            const stableBeacons = [
                this.stableBeacon,
                ...this.stableBeacons
            ];

            stableBeacons.sort((a, b) => {
                return a.accuracy > b.accuracy;
            });

            return stableBeacons;
        }

        return [
            ...this.stableBeacons
        ]
    };

    getJsonByBeacons = (beacons) => {

        return beacons && beacons
            .filter((bcn) => {
                return bcn !== undefined || bcn !== {};
            }).map((beacon) => {

                return beacon.getJson();
            });
    };
}

BeaconManager.propTypes = {
    getStableBeacons: PropTypes.func,
    recievedBeacons: PropTypes.func
};

export default new BeaconManager();

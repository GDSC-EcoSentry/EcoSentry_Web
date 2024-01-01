import { GeoPoint, Timestamp } from "@angular/fire/firestore";

export interface Station {
    id: string;
    name: string;
    location: string;
    dateCreated: Date | Timestamp;
    lastUpdate: Date | Timestamp;
    geopoint: GeoPoint;
}

export interface Node {
    id: string;
    name: string;
    geopoint: GeoPoint;
    lastUpdate: Date | Timestamp;
    chance: string;
}

export interface Datum {
    temperature: number;
    humidity: number;
    smoke: number;
    date: Date | Timestamp;
}
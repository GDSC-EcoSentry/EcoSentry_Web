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
    chance: string;
    latestData: Data | null;
}

export interface Data {
    temperature: number;
    humidity: number;
    smoke: number;
    date: Date | Timestamp;
}
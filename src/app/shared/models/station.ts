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
    temperature: number;
    humidity: number;
    co: number;
    date: Date | Timestamp;
    soil_moisture: number;
    rain: number;   
    dust: number;
}

export interface Data {
    temperature: number;
    humidity: number;
    co: number;
    date: Date | Timestamp;
    soil_moisture: number;
    rain: number;   
    dust: number;
}
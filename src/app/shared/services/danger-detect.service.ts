import { Injectable } from '@angular/core';
import { Node } from '../models/station';

@Injectable({
  providedIn: 'root'
})
export class DangerDetectService {

  //WARNING LEVELS
  levels = ['Low', 'Medium', 'High'];

  //Thresholds for warning
  tempThreshold = {
    '0': 'Low',
    '40': 'Medium',
    '50': 'High'
  };

  coThreshold = {
    '0': 'Low',
    '70': 'Medium',
    '150': 'High'
  };

  rainThreshold = {
    '0': 'Low',
    '50': 'Medium',
    '70': 'High'
  };

  dustThreshold = {
    '0': 'Low',
    '35': 'Medium',
    '50': 'High'
  };

  //Get danger level based on the thresholds
  getDangerLevel(value: number, thresholds: { [key: string]: string }): string {
    let highestLevel = 'Low'; // Default to 'Low' if no threshold is met
    for (const threshold in thresholds) {
      if (value >= parseInt(threshold) && this.levels.indexOf(thresholds[threshold]) > this.levels.indexOf(highestLevel) ) {
          highestLevel = thresholds[threshold];
      }
    }
    return highestLevel; 
  }

  //Get the level of danger for the node
  getDanger(node: Node) {
    const tempLevel = this.getDangerLevel(node.temperature, this.tempThreshold);
    const coLevel = this.getDangerLevel(node.co, this.coThreshold);
    const rainLevel = this.getDangerLevel(node.rain, this.rainThreshold);
    const dustLevel = this.getDangerLevel(node.rain, this.dustThreshold);
    const humidLevel = node.humidity >= 0 && node.humidity <= 30 ? 'High' : node.humidity >= 30 && node.humidity <= 90 ? 'Low' : 'Medium';
    const soilLevel = node.soil_moisture >= 0 && node.soil_moisture <= 20 ? 'High' : node.soil_moisture >= 20 && node.soil_moisture <= 40 ? 'Medium' : 'Low';
    
    return [tempLevel, humidLevel, soilLevel, coLevel, rainLevel, dustLevel]
    .reduce((a, b) => (this.levels.indexOf(a) > this.levels.indexOf(b) ? a : b));
  }
}

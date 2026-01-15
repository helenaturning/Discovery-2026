import { AIAlert, CheckIn, LocationData } from '../types';

/**
 * Mock AI Service for facial recognition and anomaly detection
 * In production, this would connect to real AI/ML models
 */

export class AIService {
  /**
   * Simulate facial recognition verification
   * @param imageData - Base64 encoded image data
   * @param biometricId - User's stored biometric identifier
   * @returns Confidence score (0-100) and verification result
   */
  static async verifyFace(imageData: string, biometricId: string): Promise<{
    verified: boolean;
    confidenceScore: number;
    message: string;
  }> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Mock: 90% success rate with varying confidence scores
    const success = Math.random() > 0.1;
    const confidenceScore = success 
      ? 85 + Math.random() * 15  // 85-100% for success
      : 30 + Math.random() * 40;  // 30-70% for failure
    
    return {
      verified: success,
      confidenceScore: Math.round(confidenceScore),
      message: success 
        ? 'Face recognition successful'
        : 'Face recognition failed - please try again',
    };
  }

  /**
   * Detect anomalies in employee check-in patterns
   * @param checkIns - Array of check-in records
   * @param locations - Array of location data points
   * @returns Array of detected anomalies
   */
  static detectAnomalies(
    employeeId: string,
    checkIns: CheckIn[],
    locations: LocationData[]
  ): Partial<AIAlert>[] {
    const alerts: Partial<AIAlert>[] = [];
    
    // 1. Check for GPS stability (too stable = suspicious)
    if (locations.length > 5) {
      const uniqueLocations = new Set(
        locations.map(l => `${l.latitude.toFixed(4)},${l.longitude.toFixed(4)}`)
      );
      
      if (uniqueLocations.size === 1 && locations.length > 10) {
        alerts.push({
          employeeId,
          type: 'gpsStable',
          severity: 'medium',
          timestamp: new Date(),
          details: `GPS coordinates have not changed in ${locations.length} readings`,
          confidenceScore: 75,
        });
      }
    }
    
    // 2. Check for identical selfies (mock - would use image comparison in production)
    const facialCheckIns = checkIns.filter(c => c.verificationMethod === 'facial');
    if (facialCheckIns.length >= 3) {
      // Mock: Random chance of detecting identical selfies
      if (Math.random() > 0.7) {
        alerts.push({
          employeeId,
          type: 'identicalSelfies',
          severity: 'high',
          timestamp: new Date(),
          details: 'Multiple check-ins appear to use identical or very similar photos',
          confidenceScore: 85,
        });
      }
    }
    
    // 3. Check for unrealistic movement patterns
    if (locations.length >= 2) {
      for (let i = 1; i < locations.length; i++) {
        const prev = locations[i - 1];
        const curr = locations[i];
        const timeDiff = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000; // seconds
        const distance = this.calculateDistance(
          prev.latitude,
          prev.longitude,
          curr.latitude,
          curr.longitude
        );
        
        // If moved more than 10km in less than 5 minutes (unrealistic)
        if (distance > 10 && timeDiff < 300) {
          alerts.push({
            employeeId,
            type: 'unrealisticMovement',
            severity: 'high',
            timestamp: new Date(),
            details: `Moved ${distance.toFixed(1)}km in ${Math.round(timeDiff / 60)} minutes`,
            confidenceScore: 90,
          });
        }
      }
    }
    
    // 4. Check for late authentication patterns
    const lateCheckIns = checkIns.filter(c => {
      const hour = c.timestamp.getHours();
      return hour > 9; // Starting after 9 AM
    });
    
    if (lateCheckIns.length >= 3 && lateCheckIns.length / checkIns.length > 0.5) {
      alerts.push({
        employeeId,
        type: 'lateAuth',
        severity: 'low',
        timestamp: new Date(),
        details: `${lateCheckIns.length} out of ${checkIns.length} check-ins were late`,
        confidenceScore: 70,
      });
    }
    
    return alerts;
  }

  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
   * @returns Distance in kilometers
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Calculate reliability score based on check-in history
   * @param checkIns - Employee's check-in history
   * @param alerts - Employee's anomaly alerts
   * @returns Reliability score (0-100)
   */
  static calculateReliabilityScore(
    checkIns: CheckIn[],
    alerts: AIAlert[]
  ): number {
    let score = 100;
    
    // Deduct points for failed check-ins
    const failedCheckIns = checkIns.filter(c => c.status === 'failed').length;
    score -= failedCheckIns * 5;
    
    // Deduct points for alerts
    const highSeverityAlerts = alerts.filter(a => a.severity === 'high').length;
    const mediumSeverityAlerts = alerts.filter(a => a.severity === 'medium').length;
    const lowSeverityAlerts = alerts.filter(a => a.severity === 'low').length;
    
    score -= highSeverityAlerts * 15;
    score -= mediumSeverityAlerts * 10;
    score -= lowSeverityAlerts * 5;
    
    // Bonus for consistent check-ins
    if (checkIns.length > 10 && failedCheckIns === 0) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Verify if employee is within site geofence
   */
  static isWithinGeofence(
    latitude: number,
    longitude: number,
    siteLatitude: number,
    siteLongitude: number,
    radiusMeters: number
  ): boolean {
    const distance = this.calculateDistance(latitude, longitude, siteLatitude, siteLongitude);
    return distance * 1000 <= radiusMeters; // Convert km to meters
  }
}

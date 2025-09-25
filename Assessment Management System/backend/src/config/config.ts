// Configuration for Assessment Report Generation System
// This file defines how different assessment types are handled without code changes

export interface ClassificationRange {
  min: number;
  max: number;
  label: string;
  color: string;
}

export interface FieldClassification {
  ranges: ClassificationRange[];
}

export interface AssessmentField {
  key: string;
  label: string;
  path: string;
  unit: string;
  type: string;
  classification?: FieldClassification;
}

export interface AssessmentSection {
  id: string;
  title: string;
  fields: AssessmentField[];
}

export interface AssessmentConfig {
  name: string;
  sections: AssessmentSection[];
}

export const assessmentConfigs: Record<string, AssessmentConfig> = {
  "as_hr_02": {
    name: "Health & Fitness Assessment",
    sections: [
      {
        id: "overall_health",
        title: "Overall Health Score",
        fields: [
          {
            key: "accuracy",
            label: "Overall Health Score",
            path: "accuracy",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "red" },
                { min: 51, max: 70, label: "Fair", color: "yellow" },
                { min: 71, max: 85, label: "Good", color: "green" },
                { min: 86, max: 100, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "key_vitals",
        title: "Key Body Vitals",
        fields: [
          {
            key: "heart_rate",
            label: "Heart Rate",
            path: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "blue" },
                { min: 61, max: 100, label: "Normal", color: "green" },
                { min: 101, max: 120, label: "Elevated", color: "yellow" },
                { min: 121, max: 200, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "bp_sys",
            label: "Blood Pressure Systolic",
            path: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "blue" },
                { min: 91, max: 120, label: "Normal", color: "green" },
                { min: 121, max: 140, label: "Elevated", color: "yellow" },
                { min: 141, max: 200, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "bp_dia",
            label: "Blood Pressure Diastolic",
            path: "vitalsMap.vitals.bp_dia",
            unit: "mmHg",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "blue" },
                { min: 61, max: 80, label: "Normal", color: "green" },
                { min: 81, max: 90, label: "Elevated", color: "yellow" },
                { min: 91, max: 120, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "oxy_sat",
            label: "Oxygen Saturation",
            path: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 94, label: "Low", color: "red" },
                { min: 95, max: 100, label: "Normal", color: "green" }
              ]
            }
          },
          {
            key: "resp_rate",
            label: "Respiratory Rate",
            path: "vitalsMap.vitals.resp_rate",
            unit: "breaths/min",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 12, label: "Low", color: "blue" },
                { min: 13, max: 20, label: "Normal", color: "green" },
                { min: 21, max: 30, label: "Elevated", color: "yellow" },
                { min: 31, max: 50, label: "High", color: "red" }
              ]
            }
          }
        ]
      },
      {
        id: "heart_health",
        title: "Heart Health",
        fields: [
          {
            key: "stress_index",
            label: "Stress Index",
            path: "vitalsMap.metadata.heart_scores.stress_index",
            unit: "",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 1.5, label: "Low Stress", color: "green" },
                { min: 1.6, max: 2.5, label: "Moderate Stress", color: "yellow" },
                { min: 2.6, max: 5, label: "High Stress", color: "red" }
              ]
            }
          },
          {
            key: "hrv_rmssd",
            label: "Heart Rate Variability (RMSSD)",
            path: "vitalsMap.metadata.heart_scores.rmssd",
            unit: "ms",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 20, label: "Low", color: "red" },
                { min: 21, max: 40, label: "Moderate", color: "yellow" },
                { min: 41, max: 100, label: "Good", color: "green" }
              ]
            }
          }
        ]
      },
      {
        id: "stress_level",
        title: "Stress Level",
        fields: [
          {
            key: "wellness_score",
            label: "Wellness Score",
            path: "vitalsMap.wellness_score",
            unit: "",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "red" },
                { min: 51, max: 70, label: "Fair", color: "yellow" },
                { min: 71, max: 85, label: "Good", color: "green" },
                { min: 86, max: 100, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "fitness_levels",
        title: "Fitness Levels",
        fields: [
          {
            key: "vo2max",
            label: "VO2 Max",
            path: "vitalsMap.metadata.physiological_scores.vo2max",
            unit: "ml/kg/min",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 30, label: "Poor", color: "red" },
                { min: 31, max: 40, label: "Fair", color: "yellow" },
                { min: 41, max: 50, label: "Good", color: "green" },
                { min: 51, max: 60, label: "Excellent", color: "blue" }
              ]
            }
          },
          {
            key: "cardiovascular_endurance",
            label: "Cardiovascular Endurance",
            path: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 30, label: "Poor", color: "red" },
                { min: 31, max: 60, label: "Fair", color: "yellow" },
                { min: 61, max: 90, label: "Good", color: "green" },
                { min: 91, max: 120, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "posture",
        title: "Posture",
        fields: [
          {
            key: "posture_analysis",
            label: "Posture Analysis",
            path: "exercises[?(@.id==73)].analysisScore",
            unit: "",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "red" },
                { min: 51, max: 70, label: "Fair", color: "yellow" },
                { min: 71, max: 85, label: "Good", color: "green" },
                { min: 86, max: 100, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "body_composition",
        title: "Body Composition",
        fields: [
          {
            key: "bmi",
            label: "BMI",
            path: "bodyCompositionData.BMI",
            unit: "",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 18.5, label: "Underweight", color: "blue" },
                { min: 18.6, max: 24.9, label: "Normal", color: "green" },
                { min: 25, max: 29.9, label: "Overweight", color: "yellow" },
                { min: 30, max: 50, label: "Obese", color: "red" }
              ]
            }
          },
          {
            key: "body_fat",
            label: "Body Fat Percentage",
            path: "bodyCompositionData.BFC",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 10, label: "Very Low", color: "blue" },
                { min: 11, max: 20, label: "Low", color: "green" },
                { min: 21, max: 25, label: "Normal", color: "yellow" },
                { min: 26, max: 40, label: "High", color: "red" }
              ]
            }
          }
        ]
      }
    ]
  },
  "as_card_01": {
    name: "Cardiac Assessment",
    sections: [
      {
        id: "overall_health",
        title: "Overall Health Score",
        fields: [
          {
            key: "accuracy",
            label: "Overall Health Score",
            path: "accuracy",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 50, label: "Poor", color: "red" },
                { min: 51, max: 70, label: "Fair", color: "yellow" },
                { min: 71, max: 85, label: "Good", color: "green" },
                { min: 86, max: 100, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "key_vitals",
        title: "Key Body Vitals",
        fields: [
          {
            key: "heart_rate",
            label: "Heart Rate",
            path: "vitalsMap.vitals.heart_rate",
            unit: "bpm",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "blue" },
                { min: 61, max: 100, label: "Normal", color: "green" },
                { min: 101, max: 120, label: "Elevated", color: "yellow" },
                { min: 121, max: 200, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "bp_sys",
            label: "Blood Pressure Systolic",
            path: "vitalsMap.vitals.bp_sys",
            unit: "mmHg",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 90, label: "Low", color: "blue" },
                { min: 91, max: 120, label: "Normal", color: "green" },
                { min: 121, max: 140, label: "Elevated", color: "yellow" },
                { min: 141, max: 200, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "bp_dia",
            label: "Blood Pressure Diastolic",
            path: "vitalsMap.vitals.bp_dia",
            unit: "mmHg",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 60, label: "Low", color: "blue" },
                { min: 61, max: 80, label: "Normal", color: "green" },
                { min: 81, max: 90, label: "Elevated", color: "yellow" },
                { min: 91, max: 120, label: "High", color: "red" }
              ]
            }
          },
          {
            key: "oxy_sat",
            label: "Oxygen Saturation",
            path: "vitalsMap.vitals.oxy_sat_prcnt",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 94, label: "Low", color: "red" },
                { min: 95, max: 100, label: "Normal", color: "green" }
              ]
            }
          },
          {
            key: "resp_rate",
            label: "Respiratory Rate",
            path: "vitalsMap.vitals.resp_rate",
            unit: "breaths/min",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 12, label: "Low", color: "blue" },
                { min: 13, max: 20, label: "Normal", color: "green" },
                { min: 21, max: 30, label: "Elevated", color: "yellow" },
                { min: 31, max: 50, label: "High", color: "red" }
              ]
            }
          }
        ]
      },
      {
        id: "cardiovascular_endurance",
        title: "Cardiovascular Endurance",
        fields: [
          {
            key: "cardiac_output",
            label: "Cardiac Output",
            path: "vitalsMap.metadata.cardiovascular.cardiac_out",
            unit: "L/min",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 4, label: "Low", color: "red" },
                { min: 4.1, max: 6, label: "Normal", color: "green" },
                { min: 6.1, max: 8, label: "Good", color: "blue" }
              ]
            }
          },
          {
            key: "jog_test_time",
            label: "Jog Test Duration",
            path: "exercises[?(@.id==235)].setList[0].time",
            unit: "seconds",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 30, label: "Poor", color: "red" },
                { min: 31, max: 60, label: "Fair", color: "yellow" },
                { min: 61, max: 90, label: "Good", color: "green" },
                { min: 91, max: 120, label: "Excellent", color: "blue" }
              ]
            }
          }
        ]
      },
      {
        id: "body_composition",
        title: "Body Composition",
        fields: [
          {
            key: "bmi",
            label: "BMI",
            path: "bodyCompositionData.BMI",
            unit: "",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 18.5, label: "Underweight", color: "blue" },
                { min: 18.6, max: 24.9, label: "Normal", color: "green" },
                { min: 25, max: 29.9, label: "Overweight", color: "yellow" },
                { min: 30, max: 50, label: "Obese", color: "red" }
              ]
            }
          },
          {
            key: "body_fat",
            label: "Body Fat Percentage",
            path: "bodyCompositionData.BFC",
            unit: "%",
            type: "number",
            classification: {
              ranges: [
                { min: 0, max: 10, label: "Very Low", color: "blue" },
                { min: 11, max: 20, label: "Low", color: "green" },
                { min: 21, max: 25, label: "Normal", color: "yellow" },
                { min: 26, max: 40, label: "High", color: "red" }
              ]
            }
          }
        ]
      }
    ]
  }
};

// Helper function to get value from nested object using dot notation or JSONPath-like syntax
export function getValueFromPath(obj: any, path: string): any {
  if (!path || !obj) return null;

  // Handle simple dot notation
  if (path.includes('.')) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  }

  // Handle JSONPath-like syntax for arrays (basic support)
  if (path.includes('[?(@.id==')) {
    const match = path.match(/(.+)\[\?\(@\.(.+)==(.+)\)\]\.(.+)/);
    if (match) {
      const arrayPath = match[1];
      const property = match[2];
      const value = match[3].replace(/['"]/g, '');
      const remainingPath = match[4];

      const array = getValueFromPath(obj, arrayPath);
      if (Array.isArray(array)) {
        const item = array.find((item: any) => item[property] == value);
        if (item) {
          return getValueFromPath(item, remainingPath);
        }
      }
    }
    return null;
  }

  return obj[path] || null;
}

// Helper function to classify a value based on ranges
export function classifyValue(value: any, classification: FieldClassification): { label: string; color: string } | null {
  if (!classification || !classification.ranges || !Array.isArray(classification.ranges)) {
    return null;
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return null;

  for (const range of classification.ranges) {
    if (numValue >= range.min && numValue <= range.max) {
      return { label: range.label, color: range.color };
    }
  }

  return { label: 'Out of Range', color: 'gray' };
}

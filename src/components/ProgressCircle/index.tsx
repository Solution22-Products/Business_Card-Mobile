import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../../utils/colors";

interface ProgressCircleProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0‑100
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ size = 60, strokeWidth = 6, progress }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size,}}>
      <Svg width={size} height={size} >
        <Circle
          stroke={colors.grayLight}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill={"none"}
        />
        <Circle
          stroke={colors.success}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          fill={"none"}
        />
      </Svg>
      <View style={styles.labelWrapper}>
        <Text style={styles.label}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});

export default ProgressCircle;
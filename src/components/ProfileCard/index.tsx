import React from "react";
import { View, ImageBackground, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";

interface ProfileCardProps {
  imageUri: string;
  name: string;
  designation: string;
  iconName?: string; // e.g., "person" or role-based icon
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUri, name, designation, iconName = "person" }) => {
  const resolvedSource =
    typeof imageUri === "string" && imageUri.startsWith("http")
      ? { uri: imageUri }
      : imageUri;

  return (
    <ImageBackground source={resolvedSource} style={styles.container} imageStyle={styles.backgroundImage}>
      <View style={styles.overlay} />
      <Ionicons name={iconName} size={18} color="#FFF" style={styles.roleIcon} />
      <View style={styles.bottomArea}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.designationBadge}>
          <Ionicons name="ellipse" size={6} color={colors.success} style={{ marginRight: 4 }} />
          <Text style={styles.designation}>{designation}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};


const CARD_WIDTH = 160;
const CARD_HEIGHT = 240;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  roleIcon: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  bottomArea: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  name: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  designationBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  designation: {
    color: "#E7E7E7",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ProfileCard;

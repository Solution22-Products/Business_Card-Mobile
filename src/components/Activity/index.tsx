import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

interface ActivityItemProps {
  cardType: string;
  date: string;
  time: string;
  name: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ cardType, date, time, name }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.metaText}>{cardType} • {date} at {time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 20,
    // borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection:'row',
    justifyContent:"space-between"
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  metaText: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: colors.grayLight,
//     borderRadius: 12,
//     marginVertical: 6,
//   },
//   cardType: {
//     color:"#040404",
//     fontSize: 14,
//     fontWeight:'500'
//   },
//   date: {
//     color:"#B0B0B0",
//     fontSize: 13,
//   },
//   time: {
//     color: "#B0B0B0",
//     fontSize: 13,
//   },
// });

export default ActivityItem;

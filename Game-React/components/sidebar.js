import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import "../css/board.css";

export default function Sidebar() {
    const labels = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return (
        <View>
            <div className = {"numLabels"}>
                {/* static array iteration so this should be fine */}
                {labels.map((label, i) => {
                    return <span>{label}</span>
                })}
            </div>
        </View>
    );
}

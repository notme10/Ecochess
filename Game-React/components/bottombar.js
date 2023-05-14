import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import "../css/board.css";

export default function Bottombar() {
    const labels = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return (
        <View>
            <div className = {"numLabels"}>
                {labels.map((label, i) => {
                    return <span>{label}</span>
                })}
            </div>
        </View>
    );
}

import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import "../css/board.css";

export function sidebar() {
    const labels = [<span>a</span>, 
                    <span>b</span>, 
                    <span>c</span>, 
                    <span>d</span>,
                    <span>e</span>, 
                    <span>f</span>, 
                    <span>g</span>, 
                    <span>h</span>];
    return (
        <View>
            <div className = "numLabels">
                {labels}
            </div>
        </View>
    );
}

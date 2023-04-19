import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import "../css/board.css";

export function Sidebar() {
    const labels = [<span>1</span>, 
                    <span>2</span>, 
                    <span>3</span>, 
                    <span>4</span>,
                    <span>5</span>, 
                    <span>6</span>, 
                    <span>7</span>, 
                    <span>8</span>];
    return (
        <View>
            <div className = "numLabels">
                {labels.map((label) => (
                    <span>{label}</span>
                ))}
            </div>
        </View>
    );
}

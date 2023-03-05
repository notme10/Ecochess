import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import "../css/board.css";

export function Board() {
    return (
        <View>
            <div className="row">
                <Tile /> <Tile /> <Tile /> <Tile /> <Tile /> <Tile /> <Tile /> <Tile />
            </div>
        </View>
    );
}

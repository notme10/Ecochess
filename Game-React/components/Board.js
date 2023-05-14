import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import Sidebar from "./Sidebar"
import Bottombar from "./Bottombar"
import "../css/board.css";

export default function Board() {
    const board = [];
    
    return (
        <View>
            <Sidebar></Sidebar>
            {/* tiles */}
            <Bottombar></Bottombar>
        </View>
    );
}

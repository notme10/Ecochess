import React from "react";
import { View } from "react-native";
import { Tile } from "./Tile";
import { SideBar } from "./Sidebar"
import { BottomBar } from "./bottombar"
import "../css/board.css";

export function Board() {
    const board = [];
    
    return (
        <View>
            <SideBar></SideBar>
            {/* tiles */}
            <BottomBar></BottomBar>
        </View>
    );
}

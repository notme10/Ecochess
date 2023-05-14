import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Notes:
 * virtual board in the board component (?)
 */

export default function Tile(props) {
    // checking for which tile
    const r = props.row;
    const c = props.col;
    const colNumber = col.charCodeAt(0) - 96;
    const isOdd = (row + colNumber) % 2 === 1;
    // img url given thru props (?)
    const piece = props.piece; 

    if (isOdd) {
        return (
            <View>
                {/* maybe take care of the coloration with css */}
                <div className = "dark">
                    <img src = {piece}></img>
                </div>
            </View>
        )
    }
    return (
        <View>
            <div className = "light">
                <img src = {piece}></img>
            </div>
        </View>
    )
}

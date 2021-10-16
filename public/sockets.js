socket.on("playerConnect", (data) => {
    console.log(data.name);
    console.log(data.sides);
});

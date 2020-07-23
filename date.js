
module.exports.getDate  =function getDate() {
    const today = new Date();
	
    return today.toLocaleDateString("en-US", {
        weekday: "long",
        day:"numeric",
        month: "long"
    });
}

module.exports.getDay = function getDay() {
    const today = new Date();
    return today.toLocaleDateString("en-US", { weekday: "long" });
}


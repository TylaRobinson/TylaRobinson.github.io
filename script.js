document.getElementById("saveButton").addEventListener("click", saveGoal);
function saveGoal(){
	const myGoal = document.getElementById("goalInput").value
	localStorage.setItem("goal", myGoal);
	document.getElementById("goal-spot").innerHTML = myGoal
}













